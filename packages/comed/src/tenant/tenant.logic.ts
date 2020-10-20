import { EnterpriseCollectionLogic } from "@sabasayer/enterprise";
import { TenantModel, GetTenantsRequest } from "./tenant.api";
import { TenantCollectionProvider } from "./tenant.collection-provider";
import { IEnterpriseApi } from "@sabasayer/enterprise";

export class TenantLogic extends EnterpriseCollectionLogic<
  TenantModel,
  TenantCollectionProvider
> {
  static instance: TenantLogic;

  constructor(api: IEnterpriseApi) {
    super(api, TenantCollectionProvider);
  }

  async get(options: GetTenantsRequest) {
    return this.provider.get(options, { ids: options.keys });
  }
}

TenantLogic.register();
