import { EnterpriseCollectionOptions } from "./enterprise-collection.options";
import { EnumProvideFromCacheStrategy } from "./enums/provide-from-cache-strategy.enum";
import { GetFromCacheCollectionOptions } from "./get-from-cache-collection.options";
import DataHouse from "../enterprise-data-house";
import { EnumCacheType } from "@sabasayer/utils";
import { EnterpriseApi } from "@/api/enterpise-api";
import { IApiValidationRule } from "../../api/provider/api-request-validation-rule.interface";
import { IApiResponse } from "../../api/provider/api-response.interface";
import { IApiRequestValidationResult } from "../../api/provider/api-request-validation-result.interface";
import { EnterpriseDataProvider } from "../../api/provider/enterprise-data-provider";
import { IApiRequestOptions } from "@/api/provider/api-request-options.interface";

export abstract class EnterpriseCollectionProvider<
    TModel
> extends EnterpriseDataProvider {
    protected options: EnterpriseCollectionOptions<TModel>;

    protected constructor(
        api: EnterpriseApi,
        options: EnterpriseCollectionOptions<TModel>
    ) {
        super(api);
        this.options = options;
    }

    /**
     * Decides where data will be provided by options
     * @param getFromCacheOptions how to compare and get data
     * @param apiFunc api call function to get from backend
     */
    async get<TGetRequest>(
        getRequest: TGetRequest,
        getFromCacheOptions?: GetFromCacheCollectionOptions
    ): Promise<IApiResponse<TModel[]> | never> {
        if (!this.options.cacheStrategy) {
            return this.getFromApi(getRequest);
        }

        const result = this.getFromCache(
            this.options.cacheStrategy,
            getFromCacheOptions
        );

        if (getRequest) {
            const isCacheResultLacking = this.isCacheResultLacking(
                result,
                getFromCacheOptions
            );

            if (isCacheResultLacking) return this.getFromApi(getRequest);
        }

        this.setCache(result, getFromCacheOptions?.uniqueCacheKey);

        return {
            error: false,
            data: result,
        };
    }

    async getFromApi<TGetRequest>(
        request: TGetRequest
    ): Promise<IApiResponse<TModel[]>> {
        if (!this.options.getRequestOptions)
            return {
                error: true,
                errorMessages: {
                    "collection-provider-error":
                        "get request options is absent",
                },
            };

        const validationResult = this.validateRequest(
            this.options.getRequestOptions,
            request
        );

        if (!validationResult.valid) {
            return {
                error: true,
                errorMessages: validationResult.errorMessages,
            };
        }

        return this.post(this.options.getRequestOptions.url, request);
    }

    //exclude cache functions to another class

    private setCache(data: TModel[], uniqueCacheKey?: string) {
        if (!this.options.cacheStrategy)
            throw new Error("Cache strategy is absent!");

        DataHouse.set(
            this.options.cacheStrategy,
            this.options.typename,
            data,
            uniqueCacheKey
        );
    }

    private isCacheResultLacking(
        result: TModel[],
        getOptions?: GetFromCacheCollectionOptions
    ): boolean {
        if (!getOptions || !getOptions.ids?.length) return !!result.length;

        return getOptions.ids?.length != result.length;
    }

    private getFromCache(
        strategy: EnumCacheType,
        getOptions?: GetFromCacheCollectionOptions
    ): TModel[] {
        const all = this.getAllFromCache(strategy, getOptions);
        return this.filterByCacheProvideStrategy(all, getOptions);
    }

    private getAllFromCache(
        strategy: EnumCacheType,
        getOptions?: GetFromCacheCollectionOptions
    ): TModel[] {
        return DataHouse.get(strategy, this.options.typename, getOptions);
    }

    private filterByCacheProvideStrategy(
        all: TModel[],
        getOptions?: GetFromCacheCollectionOptions
    ): TModel[] {
        const isStrategyColledtionId =
            this.options.provideFromCacheStrategy ===
            EnumProvideFromCacheStrategy.CollectionId;

        if (!getOptions || !isStrategyColledtionId) return all;

        this.checkIdOptions();

        return all.filter((item) => {
            const id = this.getIdFromItem(item);
            if (id == undefined) throw "id cannot be undefined";

            return getOptions.ids?.includes(id);
        });
    }

    private checkIdOptions(): never | void {
        if (!this.options.idField && !this.options.getIdField)
            throw new Error("idField or getIdField function must be defined");
    }

    private getIdFromItem(item: TModel) {
        this.checkIdOptions();

        return this.options.idField
            ? item[this.options.idField]
            : this.options.getIdField?.(item);
    }
}
