import { EnterpriseCollectionProvider } from "../data-house/collection/enterprise-collection-provider";
import { IEnterpriseLogic } from "./enterprise-logic.interface";
import { EnterpriseLogicQueryMessage } from "./enterprise-logic-query-message";
import { EnterpriseLogic } from "./enterprise-logic";

export abstract class EnterpriseCollectionLogic<TModel> extends EnterpriseLogic<TModel> {
    private collectionProvider: EnterpriseCollectionProvider<TModel>;

    constructor(collectionProvider: EnterpriseCollectionProvider<TModel>) {
        super()
        this.collectionProvider = collectionProvider
    }

}