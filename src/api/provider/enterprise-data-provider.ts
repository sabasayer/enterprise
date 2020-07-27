import { IApiRequestValidationResult } from "./api-request-validation-result.interface";
import { EnterpriseApi } from "../enterpise-api";
import { IApiRequestOptions } from "./api-request-options.interface";
import { validateRequest } from "../enterprise-api-validator";
import Axios, {
    AxiosResponse,
    AxiosRequestConfig,
    AxiosPromise,
    AxiosError,
    CancelTokenSource,
} from "axios";
import { IApiResponse } from "./api-response.interface";
import { HTTP_SUCCESS_CODES } from "../enterprise-api.const";
import { EnumRequestMethod } from "../enums/request-method.enum";
import { ICancellableApiResponse } from "./cancellable-api-response.interface";
import { EnterpriseApiHelper } from "../enterprise-api.helper";
import { IEnterpriseRequestOptions } from "./enterprise-request-options.interface";

export class EnterpriseDataProvider {
    protected api: EnterpriseApi;
    protected waitingRequests: Map<string, AxiosPromise>;
    protected cancelTokens: Map<string, CancelTokenSource[]>;

    constructor(api: EnterpriseApi) {
        this.api = api;
        this.waitingRequests = new Map();
        this.cancelTokens = new Map();
    }

    protected initWaitingRequests() {
        this.waitingRequests = new Map();
        this.cancelTokens = new Map();
    }

    /**
     * override for extra validation. Dont forget to call super()
     */
    protected validateRequest<TRequest>(
        requestOptions: IApiRequestOptions,
        request: TRequest
    ): IApiRequestValidationResult {
        if (!requestOptions.validationRules)
            return {
                valid: true,
            };

        return validateRequest(requestOptions.validationRules, request);
    }

    /**
     * Returns cancel token and response.
     */
    cancellableApiRequest<TRequest, TResponseModel>(
        options: IApiRequestOptions,
        request: TRequest,
        mustCheckWaitingRequest: boolean = true
    ): ICancellableApiResponse<TResponseModel> {
        const source = EnterpriseApiHelper.createCancelToken();

        const response = this.apiRequest<TRequest, TResponseModel>(
            options,
            request,
            undefined,
            mustCheckWaitingRequest,
            { cancelToken: source.token }
        );

        return { response, token: source };
    }

    protected createCancelTokenKey(
        options: IApiRequestOptions,
        uniqueKey: string
    ) {
        const requestHash = EnterpriseApiHelper.createRequestHash(
            options.url,
            options.method
        );
        return `${uniqueKey}_${requestHash}`;
    }

    protected cancelPreviousPromises(key: string) {
        const tokenList = this.cancelTokens.get(key);
        if (!tokenList) return;

        tokenList.forEach((token) => {
            token.cancel();
        });
    }

    protected deleteCancelTokens(
        options: IApiRequestOptions,
        uniqueKey: string
    ) {
        const key = this.createCancelTokenKey(options, uniqueKey);
        this.cancelTokens.delete(key);
    }

    protected registerCancelToken(token: CancelTokenSource, key: string) {
        if (!this.cancelTokens.has(key)) {
            this.cancelTokens.set(key, []);
        }

        const tokenList = this.cancelTokens.get(key);
        if (tokenList) {
            tokenList.push(token);
        }
    }

    protected handleCancelation(
        options: IApiRequestOptions,
        uniqueKey: string
    ): CancelTokenSource {
        const source = EnterpriseApiHelper.createCancelToken();

        const key = this.createCancelTokenKey(options, uniqueKey);
        this.cancelPreviousPromises(key);
        this.registerCancelToken(source, key);
        return source;
    }

    /**
     * Validates request, handles cancelation and response
     * @param cancelTokenUniqueKey unique string for grouping sameRequest.
     * Cancels existing waiting promises with same unique key and request.
     * @param mustCheckWaitingRequest Prevents paralel same request
     */
    async apiRequest<TRequest, TResponseModel>(
        options: IApiRequestOptions,
        request: TRequest,
        cancelTokenUniqueKey?: string,
        mustCheckWaitingRequest: boolean = true,
        config?: AxiosRequestConfig
    ): Promise<IApiResponse<TResponseModel>> {
        const validationResult = this.validateRequest(options, request);

        if (!validationResult.valid) {
            return {
                errorMessages: validationResult.errorMessages,
            };
        }

        if (cancelTokenUniqueKey) {
            if (!config) config = {};
            const source = this.handleCancelation(
                options,
                cancelTokenUniqueKey
            );
            config.cancelToken = source.token;
        }

        const response = await this.request<TResponseModel>({
            url: options.url,
            data: request,
            config,
            method: options.method,
            mustCheckWaitingRequest,
        });

        if (cancelTokenUniqueKey) {
            this.deleteCancelTokens(options, cancelTokenUniqueKey);
        }

        return response;
    }

    /**
     * @param {string} mustCheckWaitingRequest : default true.
     * Prevents paralel same requests
     */
    protected async request<TResponseModel>(
        options: IEnterpriseRequestOptions
    ): Promise<IApiResponse<TResponseModel>> {
        try {
            const response = await this.createResponse(options);

            return this.createResult(response);
        } catch (e) {
            const error = e as AxiosError;

            if (Axios.isCancel(e)) {
                return { canceled: true };
            }

            const createErrorMessagesFunc = this.api.getOptions()
                .createErrorMessagesFunc;

            if (error.response && createErrorMessagesFunc) {
                return {
                    errorMessages: createErrorMessagesFunc(error.response),
                };
            }

            return {
                errorMessages: { [error.name]: error.message },
            };
        }
    }

    fileUpload(
        options: IEnterpriseRequestOptions,
        onUploadProgress?: (progressEvent: ProgressEvent) => void
    ) {
        if (!options.files?.length) throw new Error("files must not be empty");

        return this.api.upload(
            options.url,
            options.files,
            options.data,
            options.dataKeyOnFileUpload,
            onUploadProgress
        );
    }

    private createRequest(options: IEnterpriseRequestOptions): AxiosPromise {
        switch (options.method) {
            case EnumRequestMethod.GET:
                return this.api.get(options.url, options.data, options.config);
            case EnumRequestMethod.PUT:
                return this.api.put(options.url, options.data, options.config);
            case EnumRequestMethod.DELETE:
                return this.api.delete(
                    options.url,
                    options.data,
                    options.config
                );
            default:
                return this.api.post(options.url, options.data, options.config);
        }
    }

    private async createResponse(
        options: IEnterpriseRequestOptions
    ): Promise<AxiosResponse> {
        let mustCheckWaitingRequest = options.mustCheckWaitingRequest ?? true;

        let response: AxiosResponse<any>;
        let request: AxiosPromise;

        const key = EnterpriseApiHelper.createUniqueKey(
            options.url,
            options.data,
            options.method
        );

        if (!mustCheckWaitingRequest) {
            request = this.createRequest(options);
            this.waitingRequests.set(key, request);
        } else {
            const waitingRequest = this.waitingRequests.get(key);
            if (waitingRequest) {
                request = waitingRequest;
            } else {
                request = this.createRequest(options);
                this.waitingRequests.set(key, request);
            }
        }

        response = await request;
        this.waitingRequests.delete(key);

        return response;
    }

    protected createResult<TResponseModel>(
        response: AxiosResponse<any>
    ): IApiResponse<TResponseModel> {
        const data = this.api.dataField
            ? response.data[this.api.dataField]
            : response.data;

        if (!HTTP_SUCCESS_CODES.includes(response.status)) {
            const createErrorMessagesFunc = this.api.getOptions()
                .createErrorMessagesFunc;

            if (response && createErrorMessagesFunc) {
                return {
                    errorMessages: createErrorMessagesFunc(response),
                };
            }

            return {
                errorMessages: { "server error": data },
            };
        }

        return {
            data: data as TResponseModel,
        };
    }
}
