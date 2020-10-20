import { AxiosResponse } from "axios";
import { IApiResponse, ICancellableApiResponse, IEnterpriseRequestOptions } from "..";
import { IApiRequestOptions } from "./api-request-options.interface";
import { IApiRequestParams } from "./api-request-params.interface";

export interface IEnterpriseDataProvider {
    cancellableApiRequest<TRequest, TResponseModel>(
        options: IApiRequestOptions,
        request: TRequest,
        mustCheckWaitingRequest: boolean
    ): ICancellableApiResponse<TResponseModel>;

    apiRequest<TRequest, TResponseModel>(
        params: IApiRequestParams<TRequest>
    ): Promise<IApiResponse<TResponseModel>>;

    fileUpload(
        options: IEnterpriseRequestOptions,
        onUploadProgress?: (progressEvent: ProgressEvent) => void
    ): Promise<AxiosResponse<any>> 
}
