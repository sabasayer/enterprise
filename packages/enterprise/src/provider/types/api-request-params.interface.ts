import { AxiosRequestConfig } from "axios";
import { IApiRequestOptions } from "./api-request-options.interface";

export interface IApiRequestParams<TRequest> {
    options: IApiRequestOptions;
    request: TRequest;
    /**
     * unique string for grouping request
     */
    cancelTokenUniqueKey?: string;
    /**
     * Prevents paralel same request
     */
    mustCheckWaitingRequest?: boolean;
    config?: AxiosRequestConfig;
}
