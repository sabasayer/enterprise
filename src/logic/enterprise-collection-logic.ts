import { EnterPriseCollectionProvider } from "../data-house/collection/enterprise-collection-provider";
import { IEnterpriseLogic } from "./enterprise-logic.interface";
import { EnterpriseLogicQueryMessage } from "./enterprise-logic-query-message";
import { EnterpriseLogic } from "./enterprise-logic";

export abstract class EnterpriseCollectionLogic<TModel> extends EnterpriseLogic<TModel> {
    private collectionProvider: EnterPriseCollectionProvider<TModel>;

    constructor(collectionProvider: EnterPriseCollectionProvider<TModel>) {
        super()
        this.collectionProvider = collectionProvider
    }

}