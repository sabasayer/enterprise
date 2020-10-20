import { AxiosRequestConfig } from "axios";
import { IApiRequestOptions } from "./api-request-options.interface";

export interface IApiRequestParams<TRequest> {
    options: IApiRequestOptions;
    request: TRequest;
    cancelTokenUniqueKey?: string;
    mustCheckWaitingRequest?: boolean;
    config?: AxiosRequestConfig;
}
