import { EnterpriseCollectionOptions } from "./enterprise-collection.options";
import { EnumProvideFromCacheStrategy } from "./enums/provide-from-cache-strategy.enum";
import { GetFromCacheCollectionOptions } from "./get-from-cache-collection.options";
import { EnumCacheType } from "@sabasayer/utils";
import { EnterpriseApi } from "@/api/enterpise-api";
import { IApiResponse } from "../../api/provider/api-response.interface";
import { EnterpriseDataProvider } from "../../api/provider/enterprise-data-provider";
import { EnumRequestMethod } from "../../api/enums/request-method.enum";
import { applyMixins } from "../../shared/mixi.helper";
import { EnterpriseCollectionCacheProvider } from "../cache/enterprise-collection-cache-provider";

interface EnterpriseCollectionProvider<TModel> extends EnterpriseCollectionCacheProvider<TModel>,
    EnterpriseDataProvider {
}

abstract class EnterpriseCollectionProvider<
    TModel
    > {
    protected options: EnterpriseCollectionOptions<TModel>;

    protected constructor(
        api: EnterpriseApi,
        options: EnterpriseCollectionOptions<TModel>
    ) {
        this.api = api;
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


        // if forceGetFromApi is true always overwrite cache
        // if compare with id and ids exists find and update or add to cache

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
}


applyMixins(EnterpriseCollectionProvider, [EnterpriseDataProvider, EnterpriseCollectionCacheProvider])

export { EnterpriseCollectionProvider }