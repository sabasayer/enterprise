import { EnterpriseCollectionProvider } from "@sabasayer/enterprise";
import {
    TenantModel,
    getTenantsRequestOptions,
    GetTenantsRequest,
} from "./tenant.api";
import { EnumCacheType } from "@sabasayer/utils";
import { EnumProvideFromCacheStrategy } from "@sabasayer/enterprise";
import { GetCollectionOptions } from "@sabasayer/enterprise";
import { IEnterpriseApi } from "@sabasayer/enterprise";

export class TenantCollectionProvider extends EnterpriseCollectionProvider<
    TenantModel,
    GetTenantsRequest
> {
    constructor(api: IEnterpriseApi) {
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
