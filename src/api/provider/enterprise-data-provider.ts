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

    protected async request<TResponseModel>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig,
        method?: EnumRequestMethod
    ): Promise<IApiResponse<TResponseModel>> {
        try {
            let response;

            console.log('api', this.api)


            switch (method) {
                case EnumRequestMethod.GET:
                    response = await this.api.get(url, data, config);
                    break;
                case EnumRequestMethod.PUT:
                    response = await this.api.post(url, data, config);
                    break;
                case EnumRequestMethod.DELETE:
                    response = await this.api.post(url, data, config);
                    break;
                default:
                    response = await this.api.post(url, data, config);
                    break

            }

            return this.createResult(response);
        } catch (e) {
            const error = e as AxiosError;
            return {
                error: true,
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
                error: true,
                errorMessages: { "server error": data },
            };
        }

        return {
            error: false,
            data: data as TResponseModel,
        };
    }
}
