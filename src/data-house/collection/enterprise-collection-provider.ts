import { EnterpriseCollectionOptions } from "./enterprise-collection.options";
import { EnumProvideFromCacheStrategy } from "./enums/provide-from-cache-strategy.enum";
import { GetFromCacheCollectionOptions } from "./get-from-cache-collection.options";
import { EnumCacheType } from "@sabasayer/utils";
import { EnterpriseApi } from "@/api/enterpise-api";
import { IApiResponse } from "../../api/provider/api-response.interface";
import { EnterpriseDataProvider } from "../../api/provider/enterprise-data-provider";
import { EnumRequestMethod } from "../../api/enums/request-method.enum";
import { EnterpriseDataHouse } from "../enterprise-data-house";
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

        let result = this.getFromCache(
            this.options.cacheStrategy,
            getFromCacheOptions
        );

        if (getRequest) {
            const isCacheResultLacking = this.isCacheResultLacking(
                result,
                getFromCacheOptions
            );

            if (isCacheResultLacking) {
                const apiResult = await this.getFromApi(getRequest);
                if (apiResult.errorMessages) return apiResult;

                result = apiResult.data ?? [];
            }
        }

        this.setCache(result, getFromCacheOptions?.uniqueCacheKey);

        return {
            data: result,
        };
    }

    async getFromApi<TGetRequest>(
        request: TGetRequest
    ): Promise<IApiResponse<TModel[]>> {
        if (!this.options.getRequestOptions)
            return {
                errorMessages: {
                    "collection-provider-error":
                        "get request options is absent",
                },
            };


        const method = this.options.isEndpointRest ? EnumRequestMethod.GET : EnumRequestMethod.POST
        return this.apiRequest(this.options.getRequestOptions, request, method)

    }

    async save<TSaveResponse>(request: object): Promise<IApiResponse<TSaveResponse>> {
        if (!this.options.saveRequestOptions)
            return {
                errorMessages: {
                    "collection-provider-error":
                        "save request options is absent",
                },
            }

        return this.apiRequest(this.options.saveRequestOptions, request, EnumRequestMethod.POST)
    }

    async delete<TDeleteResponse>(request: object, ids?: (string | number)[]): Promise<IApiResponse<TDeleteResponse>> {
        if (!this.options.deleteRequestOptions)
            return {
                errorMessages: {
                    "collection-provider-error":
                        "delete request options is absent",
                },
            }

        const method = this.options.isEndpointRest ? EnumRequestMethod.DELETE : EnumRequestMethod.POST
        const result = await this.apiRequest<object, TDeleteResponse>(this.options.deleteRequestOptions, request, method)

        if (!result.errorMessages) {
            this.removeItemsFromCache(ids);
        }

        return result;
    }

    private setCache(data: TModel[], uniqueCacheKey?: string) {
        if (!this.options.cacheStrategy)
            throw new Error("Cache strategy is absent!");

        EnterpriseDataHouse.instance.set(
            this.options.cacheStrategy,
            this.options.typename,
            data,
            uniqueCacheKey
        );
    }

    private removeItemsFromCache(ids?: (number | string)[]) {
        if (!this.options.cacheStrategy ||
            this.options.provideFromCacheStrategy != EnumProvideFromCacheStrategy.CollectionId ||
            !ids?.length) return;

        EnterpriseDataHouse.instance.removeItem<TModel>(this.options.cacheStrategy, this.options.typename, (item) => {
            const id = this.getIdFromItem(item);

            if (id == undefined) throw "id cannot be undefined";

            return ids.includes(id as string | number)
        })
    }

    private isCacheResultLacking(
        result: TModel[],
        getOptions?: GetFromCacheCollectionOptions
    ): boolean {
        if (getOptions?.forceGetFromApi) return true;

        if (!getOptions || !getOptions.ids?.length) return !result.length;

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
        return EnterpriseDataHouse.instance.get(strategy, this.options.typename, getOptions);
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

        if (!getOptions.ids?.length) return all;

        return all.filter((item) => {
            const id = this.getIdFromItem(item);
            if (id == undefined) throw "id cannot be undefined";

            return getOptions.ids?.includes(id as string | number);
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
