import {
    IEnterpriseCollectionLogic,
    EnterpriseCollectionLogic,
} from "../../../..";
import { TenantModel, GetTenantsRequest } from "./tenant.api";
import { EnterpriseApi } from "../../../..";
import { TenantCollectionProvider } from "./tenant.collection-provider";

export class TenantLogic extends EnterpriseCollectionLogic<
    TenantModel,
    TenantCollectionProvider
> {
    static instance: TenantLogic;

    constructor(api: EnterpriseApi) {
        super(new TenantCollectionProvider(api));
    }

    async get(options: GetTenantsRequest) {
        return this.provider.get(options, { ids: options.keys });
    }
}

TenantLogic.register();
