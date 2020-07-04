import { EnumProvideFromCacheStrategy } from "./enums/provide-from-cache-strategy.enum";
import { EnumCacheType } from "@sabasayer/utils";
import { IApiRequestOptions } from "../../api/provider/api-request-options.interface";

export interface EnterpriseCollectionOptions<TModel> {
    typename: string
    idField?: keyof TModel
    getIdField?: (collection: TModel) => number | string
    cacheStrategy?: EnumCacheType
    provideFromCacheStrategy?:EnumProvideFromCacheStrategy

    getRequestOptions?:IApiRequestOptions
    saveRequestOptions?:IApiRequestOptions
    deleteRequestOptions?:IApiRequestOptions
}