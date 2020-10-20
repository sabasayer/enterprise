import { EnumProvideFromCacheStrategy } from "./enums/provide-from-cache-strategy.enum";
import { EnumCacheType } from "@sabasayer/utils";
import { IApiRequestOptions } from "../types/api-request-options.interface";
import { EnterpriseCollectionCacheOptions } from "../../data-house/cache/enterprise-collection-cache.options";

export interface EnterpriseCollectionOptions<TModel> extends EnterpriseCollectionCacheOptions<TModel> {
    getRequestOptions?: IApiRequestOptions
    saveRequestOptions?: IApiRequestOptions
    deleteRequestOptions?: IApiRequestOptions

    relatedTypes?:string[]
}