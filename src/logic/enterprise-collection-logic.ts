import { EnterpriseLogic } from "./enterprise-logic";
import { IApiResponse } from "@/api/provider/api-response.interface";
import { EnterpriseCollectionProvider } from "@/data-house/collection/enterprise-collection-provider";
import { IEnterpriseCollectionLogic } from "./enterprise-collection-logic.interface";

export abstract class EnterpriseCollectionLogic<TModel> extends EnterpriseLogic<TModel> implements IEnterpriseCollectionLogic<TModel> {

}