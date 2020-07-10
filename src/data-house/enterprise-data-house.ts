import { isDevelopment } from "../helpers";
import cloneDeep from "lodash.clonedeep";
import { GetFromCacheCollectionOptions } from "./collection/get-from-cache-collection.options";
import { CacheUtil, EnumCacheType } from '@sabasayer/utils'

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

    get<TModel>(type: EnumCacheType, typename: string, getOptions?: GetFromCacheCollectionOptions): TModel[] {
        const key = getOptions?.uniqueCacheKey ?? typename;

        if (type === EnumCacheType.Memory)
            return this.getFromInMemoryCache(key);

        return CacheUtil.getFromCache(type, key) ?? [];
    }

    set(type: EnumCacheType, typename: string, collection: any[], uniqueCacheKey?: string): void {
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

    removeItem<TModel>(type: EnumCacheType, typename: string, findFunc: (item: TModel) => boolean) {
        if (type == EnumCacheType.Memory) {
            const collection = this.getFromInMemoryCache(typename, false);
            const item = collection.find(findFunc);
            if (!item) return;

            collection.remove(item);
            return;
        }

        const items = this.get<TModel>(type, typename);
        const item = items.find(findFunc);
        if (!item) return;

        items.remove(item);
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
