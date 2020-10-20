import { IApiRequestOptions } from "../../types/api-request-options.interface";
import { EnterpriseCollectionCacheOptions } from "../../../data-house";

export interface EnterpriseCollectionOptions<TModel> extends EnterpriseCollectionCacheOptions<TModel> {
    getRequestOptions?: IApiRequestOptions
    saveRequestOptions?: IApiRequestOptions
    deleteRequestOptions?: IApiRequestOptions

    relatedTypes?:string[]
}