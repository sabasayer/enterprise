import { EnterpriseCollectionOptions } from "./enterprise-collection.options";
import { EnumProvideFromCacheStrategy } from "./enums/provide-from-cache-strategy.enum";
import { GetCollectionOptions } from "./get-collection.options";
import DataHouse from '../enterprise-data-house'
import { EnumCacheType } from "@sabasayer/utils";

export class EnterPriseCollectionProvider<TModel>{
    private options: EnterpriseCollectionOptions<TModel>;

    constructor(options: EnterpriseCollectionOptions<TModel>) {
        this.options = options
    }

    /**
     * Decides where data will be provided by options
     * @param getOptions how to compare and get data
     * @param apiFunc api call function to get from backend
     */
    async getHandler(getOptions?: GetCollectionOptions, apiFunc?: () => Promise<TModel[]>): Promise<TModel[] | never> {
        if (!this.options.cacheStrategy) {
            if (!apiFunc) throw new Error("apiFunc must be provided if cacheStrategy is not set");

            return apiFunc();
        }

        const result = this.getFromCache(this.options.cacheStrategy, getOptions);

        if (getOptions?.executeApiRequestIfCacheLacking && apiFunc) {
            const isCacheResultLacking = this.isCacheResultLacking(result, getOptions)

            if (isCacheResultLacking)
                return apiFunc();
        }

        return result
    }

    private isCacheResultLacking(result: TModel[], getOptions?: GetCollectionOptions): boolean {
        if (!getOptions) return !!result.length;

        return getOptions.ids?.length != result.length
    }

    private getFromCache(strategy: EnumCacheType, getOptions?: GetCollectionOptions): TModel[] {
        const all = this.getAllFromCache(strategy, getOptions);
        return this.filterByCacheProvideStrategy(all, getOptions);
    }

    private getAllFromCache(strategy: EnumCacheType, getOptions?: GetCollectionOptions): TModel[] {
        return DataHouse.get(strategy, this.options.typename, getOptions)
    }

    private filterByCacheProvideStrategy(all: TModel[], getOptions?: GetCollectionOptions): TModel[] {
        const isStrategyColledtionId = this.options.provideFromCacheStrategy === EnumProvideFromCacheStrategy.CollectionId;

        if (!getOptions || !isStrategyColledtionId) return all;

        this.checkIdOptions()

        return all.filter(item => {
            const id = this.getIdFromItem(item);
            if (id == undefined) throw "id cannot be undefined";

            return getOptions.ids?.includes(id);
        })

    }

    private checkIdOptions(): never | void {
        if (!this.options.idField && !this.options.getIdField)
            throw new Error("idField or getIdField function must be defined");
    }

    private getIdFromItem(item: TModel) {
        this.checkIdOptions()

        return this.options.idField ? item[this.options.idField] : this.options.getIdField?.(item)
    }
}