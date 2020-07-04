import { IApiValidationRule } from "./api-request-validation-rule.interface";
import { IApiRequestValidationResult } from "./api-request-validation-result.interface";
import { EnterpriseApi } from "@/api/enterpise-api";
import { IApiRequestOptions } from "./api-request-options.interface";
import { validateRequest } from "@/api/enterprise-api-validator";
import Axios, {
    AxiosResponse,
    AxiosRequestConfig,
    AxiosPromise,
    AxiosError,
} from "axios";
import { IApiResponse } from "./api-response.interface";

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

    protected async post<TResponseModel>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<IApiResponse<TResponseModel>> {
        try {
            const response = await this.api.post(url, data, config);
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

        if (response.status != 200) {
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
