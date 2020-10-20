import { GetCollectionOptions } from "../../provider";

export interface IEnterpriseCollectionCacheProvider<TModel> {
    setCache(data: TModel[], uniqueCacheKey?: string): void;

    /**
     * Pushes new items to cache
     */
    addItemsToCache(newItems: TModel[], uniqueCacheKey?: string): void;

    /**
     * Removes items by id field
     * @param ids id fields of items that will be removed
     */
    removeItemsFromCache(ids?: (number | string)[]): void;

    getFromCache(
        getOptions?: GetCollectionOptions<TModel>,
        uniqueCacheKey?: string
    ): TModel[];
    clearCache(uniqueCacheKey?: string): void;

    getIdFromItem(item: TModel): any;
}
