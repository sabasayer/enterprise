import { EnumProvideFromCacheStrategy } from "./enums/provide-from-cache-strategy.enum";
import { EnumCacheType } from "@sabasayer/utils";
import { IApiRequestOptions } from "../../api/provider/api-request-options.interface";
import { EnterpriseCollectionCacheOptions } from "../cache/enterprise-collection-cache.options";

export interface EnterpriseCollectionOptions<TModel> extends EnterpriseCollectionCacheOptions<TModel> {
    isEndpointRest?: boolean
    getRequestOptions?: IApiRequestOptions
    saveRequestOptions?: IApiRequestOptions
    deleteRequestOptions?: IApiRequestOptions
}