import { EnumCacheType } from "@sabasayer/utils";
import { EnumProvideFromCacheStrategy } from "../../provider/collection/enums/provide-from-cache-strategy.enum";

export interface EnterpriseCollectionCacheOptions<TModel>{
    typename: string
    idField?: keyof TModel
    getIdField?: (collection: TModel) => number | string
    cacheStrategy?: EnumCacheType
    provideFromCacheStrategy?: EnumProvideFromCacheStrategy
}