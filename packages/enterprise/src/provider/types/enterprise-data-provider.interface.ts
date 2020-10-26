import { AxiosResponse } from "axios";
import { IApiResponse, ICancellableApiResponse, IEnterpriseRequestOptions } from "..";
import { IApiRequestOptions } from "./api-request-options.interface";
import { IApiRequestParams } from "./api-request-params.interface";

export interface IEnterpriseDataProvider {
    cancellableApiRequest<TRequest, TResponse>(
        options: IApiRequestOptions<TResponse>,
        request: TRequest,
        mustCheckWaitingRequest: boolean
    ): ICancellableApiResponse<TResponse>;

    apiRequest<TRequest, TResponse>(
        params: IApiRequestParams<TRequest, TResponse>
    ): Promise<IApiResponse<TResponse>>;

    fileUpload(
        options: IEnterpriseRequestOptions,
        onUploadProgress?: (progressEvent: ProgressEvent) => void
    ): Promise<AxiosResponse<any>>;
}
