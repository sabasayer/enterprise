import { EnterpriseDataProvider } from "@/api/provider/enterprise-data-provider";
import { EnterpriseCollectionCacheProvider } from "../cache/enterprise-collection-cache-provider";

export interface EnterpriseCollectionProvider<TModel> extends EnterpriseCollectionCacheProvider<TModel>,
    EnterpriseDataProvider {

}