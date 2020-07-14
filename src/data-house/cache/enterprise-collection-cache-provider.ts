import { EnterpriseCollectionOptions } from "../collection/enterprise-collection.options";
import { EnterpriseCollectionCacheOptions } from "./enterprise-collection-cache.options";
import { EnterpriseDataHouse } from "../enterprise-data-house";
import { EnumProvideFromCacheStrategy } from "../collection/enums/provide-from-cache-strategy.enum";
import { EnumCacheType } from "@sabasayer/utils";
import { GetFromCacheCollectionOptions } from "../collection/get-from-cache-collection.options";

export class EnterpriseCollectionCacheProvider<TModel>{
    protected options: EnterpriseCollectionOptions<TModel>;

    constructor(options: EnterpriseCollectionCacheOptions<TModel>) {
        this.options = options
    }

    setCache(data: TModel[], uniqueCacheKey?: string) {
        if (!this.options.cacheStrategy)
            throw new Error("Cache strategy is absent!");

        EnterpriseDataHouse.instance.set(
            this.options.cacheStrategy,
            this.options.typename,
            data,
            uniqueCacheKey
        );
    }

    /**
     * Pushs new items to cache
     */
    addItemsToCache(newItems: TModel[], uniqueCacheKey?: string) {
        if (!this.options.cacheStrategy) return;

        const hasMeansToFindIdfield = this.options.provideFromCacheStrategy == EnumProvideFromCacheStrategy.CollectionId &&
            (this.options.idField || this.options.getIdField)

        const compareFunc = (cachedItem: TModel, newItem: TModel) => {
            const cachedItemId = this.getIdFromItem(cachedItem);
            const newItemId = this.getIdFromItem(newItem);

            if (!cachedItem)
                throw `cached item : ${JSON.stringify(cachedItem)} id cannot be undefined`;

            if (!newItemId)
                throw `new item : ${JSON.stringify(cachedItem)} id cannot be undefined`;

            return cachedItemId == newItemId;
        }

        EnterpriseDataHouse.instance.addItems<TModel>(this.options.cacheStrategy, this.options.typename, newItems,
            hasMeansToFindIdfield ? compareFunc : undefined, uniqueCacheKey)
    }

    /**
     * Removes items by id field
     * @param ids id fields of items that will be removed
     */
    removeItemsFromCache(ids?: (number | string)[]) {
        const hasMeansToFindIdfield = this.options.provideFromCacheStrategy == EnumProvideFromCacheStrategy.CollectionId &&
            ids?.length

        if (!this.options.cacheStrategy || !hasMeansToFindIdfield) return;

        EnterpriseDataHouse.instance.removeItems<TModel>(this.options.cacheStrategy, this.options.typename, (item) => {
            const id = this.getIdFromItem(item);

            if (id == undefined) throw "id cannot be undefined";

            return !!ids?.includes(id as string | number)
        })
    }

    getFromCache(
        getOptions?: GetFromCacheCollectionOptions
    ): TModel[] {
        if (!this.options.cacheStrategy)
            throw new Error("Cache strategy is absent !");

        const all = this.getAllFromCache(this.options.cacheStrategy, getOptions);
        return this.filterByCacheProvideStrategy(all, getOptions);
    }

    clearCache(uniqueCacheKey?: string) {
        if (!this.options.cacheStrategy)
            throw new Error("Cache strategy is absent !");


        EnterpriseDataHouse.instance.clear(this.options.cacheStrategy, this.options.typename, uniqueCacheKey)
    }

    protected isCacheResultLacking(
        result: TModel[],
        getOptions?: GetFromCacheCollectionOptions
    ): boolean {
        if (getOptions?.forceGetFromApi) return true;

        if (!getOptions || !getOptions.ids?.length) return !result.length;

        return getOptions.ids?.length != result.length;
    }


    protected getAllFromCache(
        strategy: EnumCacheType,
        getOptions?: GetFromCacheCollectionOptions
    ): TModel[] {
        return EnterpriseDataHouse.instance.get(strategy, this.options.typename, getOptions);
    }


    protected filterByCacheProvideStrategy(
        all: TModel[],
        getOptions?: GetFromCacheCollectionOptions
    ): TModel[] {
        const isStrategyColledtionId =
            this.options.provideFromCacheStrategy ===
            EnumProvideFromCacheStrategy.CollectionId;

        if (!getOptions || !isStrategyColledtionId) return all;

        this.checkIdOptions();

        if (!getOptions.ids?.length) return all;

        return all.filter((item) => {
            const id = this.getIdFromItem(item);
            if (id == undefined) throw "id cannot be undefined";

            return getOptions.ids?.includes(id as string | number);
        });
    }

    protected checkIdOptions(): never | void {
        if (!this.options.idField && !this.options.getIdField)
            throw new Error("idField or getIdField function must be defined");
    }

    protected getIdFromItem(item: TModel) {
        this.checkIdOptions();

        return this.options.idField
            ? item[this.options.idField]
            : this.options.getIdField?.(item);
    }
}