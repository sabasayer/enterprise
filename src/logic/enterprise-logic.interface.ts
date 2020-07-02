import { EnterPriseCollectionProvider } from "../data-house/collection/enterprise-collection-provider";
import { EnterpriseViewModelProvider } from "./view-model-provider/enterprise-view-model-provider";
import { EnterpriseLogicQueryMessage } from "./enterprise-logic-query-message";

export interface IEnterpriseLogic<TModel> {
    get?: <TGetOptions>(options: TGetOptions) => Promise<EnterpriseLogicQueryMessage<TModel[]>>
    getOne?: <TGetOptions>(options: TGetOptions) => Promise<EnterpriseLogicQueryMessage<TModel>>
    save?<TSaveOptions>(options: TSaveOptions): Promise<EnterpriseLogicQueryMessage<any>>
    delete?<TDeleteOptions>(options: TDeleteOptions): Promise<EnterpriseLogicQueryMessage<any>>
    validate?(model: TModel): boolean | Promise<boolean>
}