import { EnterpriseCollectionProvider } from "../../../src/data-house/collection/enterprise-collection-provider";
import {
    TenantModel,
    getTenantsRequestOptions,
    GetTenantsRequest,
} from "./tenant.api";
import { EnterpriseApi } from "../../..";
import { EnumCacheType } from "@sabasayer/utils";
import { EnumProvideFromCacheStrategy } from "../../../src/data-house/collection/enums/provide-from-cache-strategy.enum";
import { GetCollectionOptions } from "../../..";

export class TenantCollectionProvider extends EnterpriseCollectionProvider<
    TenantModel
> {
    constructor(api: EnterpriseApi) {
        super(api, {
            typename: "tenant",
            cacheStrategy: EnumCacheType.SessionStorage,
            getRequestOptions: getTenantsRequestOptions,
            idField: "id",
            provideFromCacheStrategy: EnumProvideFromCacheStrategy.CollectionId,
        });
    }

    async get(request: GetTenantsRequest, getOptions?: GetCollectionOptions) {
        return super.get(request, getOptions);
    }
}
