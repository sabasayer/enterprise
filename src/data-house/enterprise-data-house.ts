import { isDevelopment } from "../helpers";
import cloneDeep from "lodash.clonedeep";
import { GetFromCacheCollectionOptions } from "./collection/get-from-cache-collection.options";
import { CacheUtil, EnumCacheType } from '@sabasayer/utils'

declare global {
    interface Window { enterpriseDataHouse: any }
}

class EnterpriseDataHouse {
    private collections: Map<string, any[]> = new Map();

    constructor() {
        if (isDevelopment())
            this.debug()
    }

    private debug() {
        window.enterpriseDataHouse = this;
    }

    get<TModel>(type: EnumCacheType, typename: string, getOptions?: GetFromCacheCollectionOptions): TModel[] {
        if (type === EnumCacheType.Memory)
            return this.getFromInMemoryCache(typename);

        const key = getOptions?.uniqueCacheKey ?? typename;
        return CacheUtil.getFromCache(type, key) ?? [];
    }

    set(type: EnumCacheType, typename: string, collection: any[], uniqueCacheKey?: string): void {
        if (type === EnumCacheType.Memory) {
            this.setInMemoryCacahe(typename, collection)
            return;
        }

        const key = uniqueCacheKey ?? typename;
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

    /**
     * Get cloned values for immutability of stored data
     * @param typename stored typename
     */
    private getFromInMemoryCache(typename: string): any[] {
        return cloneDeep(this.collections.get(typename)) ?? [];
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

const dataHouse = new EnterpriseDataHouse();

export default dataHouse