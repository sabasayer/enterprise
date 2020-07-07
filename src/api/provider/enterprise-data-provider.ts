import { IApiValidationRule } from "./api-request-validation-rule.interface";
import { IApiRequestValidationResult } from "./api-request-validation-result.interface";
import { EnterpriseApi } from "../enterpise-api";
import { IApiRequestOptions } from "./api-request-options.interface";
import { validateRequest } from "../enterprise-api-validator";
import Axios, {
    AxiosResponse,
    AxiosRequestConfig,
    AxiosPromise,
    AxiosError,
} from "axios";
import { IApiResponse } from "./api-response.interface";
import { HTTP_SUCCESS_CODES } from "../enterprise-api.const";
import { EnumRequestMethod } from "../enums/request-method.enum";

export class EnterpriseDataProvider {
    protected api: EnterpriseApi;

    constructor(api: EnterpriseApi) {
        this.api = api;
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

    async apiRequest<TRequest, TResponseModel>(options: IApiRequestOptions, request: TRequest, method?: EnumRequestMethod): Promise<IApiResponse<TResponseModel>> {
        const validationResult = this.validateRequest(options, request);

        if (!validationResult.valid) {
            return {
                errorMessages: validationResult.errorMessages,
            };
        }

        return this.request(options.url, request, undefined, method);
    }

    protected async request<TResponseModel>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig,
        method?: EnumRequestMethod
    ): Promise<IApiResponse<TResponseModel>> {
        try {
            let response;

            switch (method) {
                case EnumRequestMethod.GET:
                    response = await this.api.get(url, data, config);
                    break;
                case EnumRequestMethod.PUT:
                    response = await this.api.put(url, data, config);
                    break;
                case EnumRequestMethod.DELETE:
                    response = await this.api.delete(url, data, config);
                    break;
                default:
                    response = await this.api.post(url, data, config);
                    break

            }

            return this.createResult(response);
        } catch (e) {
            const error = e as AxiosError;
            return {
                errorMessages: { [error.name]: error.message },
            };
        }
    }

    protected createResult<TResponseModel>(
        response: AxiosResponse<any>
    ): IApiResponse<TResponseModel> {
        const data = response.data;

        if (!HTTP_SUCCESS_CODES.includes(response.status)) {
            return {
                errorMessages: { "server error": data },
            };
        }

        return {
            data: data as TResponseModel,
        };
    }
}
