import { EnterpriseCollectionOptions } from "./enterprise-collection.options";
import { EnumProvideFromCacheStrategy } from "./enums/provide-from-cache-strategy.enum";
import { EnumCacheType } from "@sabasayer/utils";
import { EnterpriseApi } from "../../api/enterpise-api";
import { IApiResponse } from "../../api/provider/api-response.interface";
import { EnterpriseDataProvider } from "../../api/provider/enterprise-data-provider";
import { EnumRequestMethod } from "../../api/enums/request-method.enum";
import { applyMixins } from "../../shared/mixin.helper";
import { EnterpriseCollectionCacheProvider } from "../cache/enterprise-collection-cache-provider";
import { GetCollectionOptions } from "./get-collection.options";
import { EnterpriseApiHelper } from "../../api/enterprise-api.helper";
import { EnterpriseObservable, IEnterpriseSubscription } from "../observable";
import { EnterpriseObservableHouse } from "../observable/enterprise-observable-house";

interface EnterpriseCollectionProvider<
    TModel,
    TSaveRequest = undefined,
    TSaveResponse = undefined,
    TDeleteRequest = undefined,
    TDeleteResponse = undefined,
> extends EnterpriseCollectionCacheProvider<TModel>, EnterpriseDataProvider {}

class EnterpriseCollectionProvider<
    TModel,
    TSaveRequest = undefined,
    TSaveResponse = undefined,
    TDeleteRequest = undefined,
    TDeleteResponse = undefined,
> {
    protected options: EnterpriseCollectionOptions<TModel>;
    protected observable: EnterpriseObservable<TModel>;

    constructor(
        api: EnterpriseApi,
        options: EnterpriseCollectionOptions<TModel>
    ) {
        this.api = api;
        this.options = options;
        this.observable = new EnterpriseObservable(options.typename);
        this.initWaitingRequests();
    }

    subscribe(options: IEnterpriseSubscription<TModel>) {
        this.observable.subscribe(options);
    }

    unsubscribe(id: string) {
        this.observable.unsubscribe(id);
    }

    /**
     * Decides where data will be provided by options.
     * Cache or Api
     * @param getOptions how to compare and get data
     * @param apiFunc api call function to get from backend
     */
    async get(
        getRequest: object,
        getOptions?: GetCollectionOptions<TModel>
    ): Promise<IApiResponse<TModel[]> | never> {
        if (!this.options.cacheStrategy) {
            return this.getFromApi(
                getRequest,
                getOptions?.cancelTokenUniqueKey
            );
        }

        let result = !getOptions?.forceGetFromApi
            ? this.getFromCache(getOptions)
            : [];

        if (getRequest) {
            const isCacheResultLacking = this.isCacheResultLacking(
                result,
                getOptions
            );

            if (isCacheResultLacking) {
                const apiResult = await this.getFromApi(
                    getRequest,
                    getOptions?.cancelTokenUniqueKey
                );

                if (apiResult.errorMessages || apiResult.canceled)
                    return apiResult;

                result = apiResult.data ?? [];
            }
        }

        const uniqueCacheKey = this.createRequestHash(getRequest);
        this.setCache(result, uniqueCacheKey);

        return {
            data: result,
        };
    }

    createRequestHash<TRequest>(request: TRequest) {
        return this.options.provideFromCacheStrategy ==
            EnumProvideFromCacheStrategy.RequestParamsHash
            ? EnterpriseApiHelper.createDataHash(request)
            : undefined;
    }

    /**
     * @param cancelTokenUniqueKey Group cancel tokens by this key.
     * And cancel previous ones with same key
     */
    async getFromApi<TGetRequest>(
        request: TGetRequest,
        cancelTokenUniqueKey?: string
    ): Promise<IApiResponse<TModel[]>> {
        if (!this.options.getRequestOptions)
            return {
                errorMessages: {
                    "collection-provider-error":
                        "get request options is absent",
                },
            };

        return this.apiRequest(
            this.options.getRequestOptions,
            request,
            cancelTokenUniqueKey
        );
    }

    /**
     * @param mapResponseToModel Runs after request succeeded,
     * creates array for saving to cache
     */
    async save(
        request: TSaveRequest,
        mapResponseToModel?: (response: TSaveResponse) => TModel[]
    ): Promise<IApiResponse<TSaveResponse>> {
        if (!this.options.saveRequestOptions)
            return {
                errorMessages: {
                    "collection-provider-error":
                        "save request options is absent",
                },
            };

        const result = await this.apiRequest<TSaveRequest, TSaveResponse>(
            this.options.saveRequestOptions,
            request
        );

        if (
            !result.errorMessages &&
            !result.canceled &&
            result.data &&
            mapResponseToModel
        ) {
            const items = mapResponseToModel(result.data);
            this.observable.addedMany(items);
            this.handleSideEffects();

            this.addItemsToCache(items);
        }

        return result;
    }

    handleSideEffects() {
        if (!this.options.relatedTypes?.length) return;

        this.options.relatedTypes?.forEach((type) => {
            const observable = EnterpriseObservableHouse.instance.get(type);

            if (!observable) return;

            observable.sideEffected();
        });
    }

    /**
     * @param ids Removed item ids to remove from cache
     */
    async delete(
        request: TDeleteRequest,
        ids?: (string | number)[]
    ): Promise<IApiResponse<TDeleteResponse>> {
        if (!this.options.deleteRequestOptions)
            return {
                errorMessages: {
                    "collection-provider-error":
                        "delete request options is absent",
                },
            };

        const result = await this.apiRequest<TDeleteRequest, TDeleteResponse>(
            this.options.deleteRequestOptions,
            request
        );

        if (!result.errorMessages && !result.canceled && ids) {
            this.observable.removedMany(ids);
            this.handleSideEffects();

            this.removeItemsFromCache(ids);
        }

        return result;
    }
}

applyMixins(EnterpriseCollectionProvider, [
    EnterpriseDataProvider,
    EnterpriseCollectionCacheProvider,
]);

export { EnterpriseCollectionProvider };
