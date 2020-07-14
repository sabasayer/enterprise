import { isDevelopment } from "../helpers";
import cloneDeep from "lodash.clonedeep";
import { CacheUtil, EnumCacheType, cache } from '@sabasayer/utils'
import { GetCollectionOptions } from "./collection/get-collection.options";

declare global {
    interface Window { enterpriseDataHouse: any }
}

export class EnterpriseDataHouse {
    static instance: EnterpriseDataHouse;
    private collections: Map<string, any[]> = new Map();

    constructor() {
        if (isDevelopment())
            this.debug()
    }

    private static initialize = (() => {
        EnterpriseDataHouse.instance = new EnterpriseDataHouse();
    })();

    private debug() {
        window.enterpriseDataHouse = this;
    }

    get<TModel>(type: EnumCacheType, typename: string, uniqueCacheKey?: string): TModel[] {
        const key = uniqueCacheKey ?? typename;

        if (type === EnumCacheType.Memory)
            return this.getFromInMemoryCache(key);

        return CacheUtil.getFromCache(type, key) ?? [];
    }

    set<TModel>(type: EnumCacheType, typename: string, collection: TModel[], uniqueCacheKey?: string): void {
        const key = uniqueCacheKey ?? typename;

        if (type === EnumCacheType.Memory) {
            this.setInMemoryCacahe(key, collection)
            return;
        }

        CacheUtil.addToCache(type, key, collection);
    }

    clear(type: EnumCacheType, typename: string, uniqueCacheKey?: string) {
        if (type === EnumCacheType.Memory) {
            this.clearInMemoryCache(typename)
            return;
        }

        const key = uniqueCacheKey ?? typename;
        CacheUtil.clearCache(type, key);
    }

    addItems<TModel>(
        type: EnumCacheType,
        typename: string,
        collection: TModel[],
        compareFunc?: (cachedItem: TModel, item: TModel) => boolean,
        uniqueCacheKey?: string): void {
        let cachedItems: TModel[] | undefined;
        const key = uniqueCacheKey ?? typename;

        if (type == EnumCacheType.Memory) {
            cachedItems = this.getFromInMemoryCache(key, false);
        }
        else
            cachedItems = this.get<TModel>(type, key);

        if (!cachedItems.length) {
            this.set(type, key, collection);
            return;
        }

        const statement = compareFunc ?
            ((newItem: TModel) => !!cachedItems?.every(cachedItem => !compareFunc(cachedItem, newItem))) :
            undefined


        cachedItems.pushRange(collection, statement)

        if (type == EnumCacheType.Memory)
            return;

        this.set(type, key, cachedItems);
    }

    removeItems<TModel>(type: EnumCacheType, typename: string, filterFunc: (item: TModel) => boolean) {
        if (type == EnumCacheType.Memory) {
            const collection = this.getFromInMemoryCache(typename, false);
            collection.findRemove(filterFunc);
            return;
        }

        const items = this.get<TModel>(type, typename);
        items.findRemove(filterFunc);
        this.set(type, typename, items)
    }

    /**
     * Get cloned values for immutability of stored data
     * @param typename stored typename
     */
    private getFromInMemoryCache(typename: string, clone: boolean = true): any[] {
        const collection = this.collections.get(typename) ?? [];

        return clone ? cloneDeep(collection) : collection;
    }

    /**
     * If data with same typename exists overrides the existing data
     * @param typename uniq name for storing data
     */
    private setInMemoryCacahe(typename: string, collection: any[]) {
        this.collections.set(typename, collection)
    }

    private clearInMemoryCache(typename: string) {
        this.collections.delete(typename)
    }

}
