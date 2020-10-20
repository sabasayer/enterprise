import { EnumCacheType } from "@sabasayer/utils";

export interface IEnterpriseDataHouse {
    get<TModel>(
        type: EnumCacheType,
        typename: string,
        uniqueCacheKey?: string
    ): TModel[];

    set<TModel>(
        type: EnumCacheType,
        typename: string,
        collection: TModel[],
        uniqueCacheKey?: string
    ): void;

    clear(type: EnumCacheType, typename: string, uniqueCacheKey?: string): void;

    addItems<TModel>(
        type: EnumCacheType,
        typename: string,
        collection: TModel[],
        compareFunc?: (cachedItem: TModel, item: TModel) => boolean,
        uniqueCacheKey?: string
    ): void;

    removeItems<TModel>(
        type: EnumCacheType,
        typename: string,
        filterFunc: (item: TModel) => boolean
    ): void;
}
