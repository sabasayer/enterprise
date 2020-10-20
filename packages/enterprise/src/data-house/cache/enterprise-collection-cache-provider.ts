import { EnterpriseCollectionOptions } from "../../provider/collection/enterprise-collection.options";
import { EnterpriseCollectionCacheOptions } from "./enterprise-collection-cache.options";
import { EnterpriseDataHouse } from "../enterprise-data-house";
import { EnumProvideFromCacheStrategy } from "../../provider/collection/enums/provide-from-cache-strategy.enum";
import { EnumCacheType } from "@sabasayer/utils";
import { GetCollectionOptions } from "../../provider/collection/get-collection.options";

export class EnterpriseCollectionCacheProvider<TModel> {
    protected options: EnterpriseCollectionOptions<TModel>;

    constructor(options: EnterpriseCollectionCacheOptions<TModel>) {
        this.options = options;
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
     * Pushes new items to cache
     */
    addItemsToCache(newItems: TModel[], uniqueCacheKey?: string) {
        if (!this.options.cacheStrategy) return;

        const hasMeansToFindIdfield =
            this.options.provideFromCacheStrategy ==
                EnumProvideFromCacheStrategy.CollectionId &&
            (this.options.idField || this.options.getIdField);

        const compareFunc = (cachedItem: TModel, newItem: TModel) => {
            const cachedItemId = this.getIdFromItem(cachedItem);
            const newItemId = this.getIdFromItem(newItem);

            if (!cachedItem)
                throw `cached item : ${JSON.stringify(
                    cachedItem
                )} id cannot be undefined`;

            if (!newItemId)
                throw `new item : ${JSON.stringify(
                    cachedItem
                )} id cannot be undefined`;

            return cachedItemId == newItemId;
        };

        EnterpriseDataHouse.instance.addItems<TModel>(
            this.options.cacheStrategy,
            this.options.typename,
            newItems,
            hasMeansToFindIdfield ? compareFunc : undefined,
            uniqueCacheKey
        );
    }

    /**
     * Removes items by id field
     * @param ids id fields of items that will be removed
     */
    removeItemsFromCache(ids?: (number | string)[]) {
        const hasMeansToFindIdfield =
            this.options.provideFromCacheStrategy ==
                EnumProvideFromCacheStrategy.CollectionId && ids?.length;

        if (!this.options.cacheStrategy || !hasMeansToFindIdfield) return;

        EnterpriseDataHouse.instance.removeItems<TModel>(
            this.options.cacheStrategy,
            this.options.typename,
            (item) => {
                const id = this.getIdFromItem(item);

                if (id == undefined) throw "id cannot be undefined";

                return !!ids?.includes(id as string | number);
            }
        );
    }

    getFromCache(
        getOptions?: GetCollectionOptions<TModel>,
        uniqueCacheKey?: string
    ): TModel[] {
        if (!this.options.cacheStrategy)
            throw new Error("Cache strategy is absent !");

        const all = this.getAllFromCache(
            this.options.cacheStrategy,
            uniqueCacheKey
        );
        return this.filterByCacheProvideStrategy(all, getOptions);
    }

    clearCache(uniqueCacheKey?: string) {
        if (!this.options.cacheStrategy)
            throw new Error("Cache strategy is absent !");

        EnterpriseDataHouse.instance.clear(
            this.options.cacheStrategy,
            this.options.typename,
            uniqueCacheKey
        );
    }

    protected isCacheResultLacking(
        result: TModel[],
        getOptions?: GetCollectionOptions<TModel>
    ): boolean {
        if (getOptions?.forceGetFromApi) return true;

        if (!getOptions || !getOptions.ids?.length) return !result.length;

        return getOptions.ids?.length != result.length;
    }

    protected getAllFromCache(
        strategy: EnumCacheType,
        uniqueCacheKey?: string
    ): TModel[] {
        return EnterpriseDataHouse.instance.get(
            strategy,
            this.options.typename,
            uniqueCacheKey
        );
    }

    protected filterByCacheProvideStrategy(
        all: TModel[],
        getOptions?: GetCollectionOptions<TModel>
    ): TModel[] {
        if (!getOptions) return all;

        if (getOptions.filterFunc)
            return all.filter((e) => getOptions.filterFunc?.(e));

        return this.filterByIdOptions(all, getOptions);
    }

    protected filterByIdOptions(
        all: TModel[],
        getOptions?: GetCollectionOptions<TModel>
    ): TModel[] {
        const isStrategyCollectionId =
            this.options.provideFromCacheStrategy ===
            EnumProvideFromCacheStrategy.CollectionId;

        if (!isStrategyCollectionId) return all;

        this.checkIdOptions();

        if (!getOptions?.ids?.length) return all;

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

    getIdFromItem(item: TModel) {
        this.checkIdOptions();

        return this.options.idField
            ? item[this.options.idField]
            : this.options.getIdField?.(item);
    }
}
