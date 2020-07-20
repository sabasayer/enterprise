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

interface EnterpriseCollectionProvider<TModel>
    extends EnterpriseCollectionCacheProvider<TModel>,
        EnterpriseDataProvider {}

class EnterpriseCollectionProvider<TModel> {
    protected options: EnterpriseCollectionOptions<TModel>;

    constructor(
        api: EnterpriseApi,
        options: EnterpriseCollectionOptions<TModel>
    ) {
        this.api = api;
        this.options = options;
        this.initWaitingRequests();
    }

    /**
     * Decides where data will be provided by options
     * @param getOptions how to compare and get data
     * @param apiFunc api call function to get from backend
     */
    async get<TGetRequest>(
        getRequest: TGetRequest,
        getOptions?: GetCollectionOptions
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

        // if forceGetFromApi is true always overwrite cache
        // if compare with id and ids exists find and update or add to cache

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

    async save<TSaveResponse>(
        request: object,
        saveToCacheFunc?: (response: TSaveResponse) => TModel[]
    ): Promise<IApiResponse<TSaveResponse>> {
        if (!this.options.saveRequestOptions)
            return {
                errorMessages: {
                    "collection-provider-error":
                        "save request options is absent",
                },
            };

        const result = await this.apiRequest<object, TSaveResponse>(
            this.options.saveRequestOptions,
            request
        );

        if (
            !result.errorMessages &&
            !result.canceled &&
            result.data &&
            saveToCacheFunc
        ) {
            const items = saveToCacheFunc(result.data);
            this.addItemsToCache(items);
        }

        return result;
    }

    async delete<TDeleteResponse>(
        request: object,
        ids?: (string | number)[]
    ): Promise<IApiResponse<TDeleteResponse>> {
        if (!this.options.deleteRequestOptions)
            return {
                errorMessages: {
                    "collection-provider-error":
                        "delete request options is absent",
                },
            };

        const result = await this.apiRequest<object, TDeleteResponse>(
            this.options.deleteRequestOptions,
            request
        );

        if (!result.errorMessages && !result.canceled) {
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
