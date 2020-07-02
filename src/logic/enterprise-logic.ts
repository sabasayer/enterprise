import { EnterPriseCollectionProvider } from "../data-house/collection/enterprise-collection-provider";
import { EnterpriseLogicQueryMessage } from "./enterprise-logic-query-message";

export class EnterpriseLogic<TModel>{

    async get?<TGetOptions>(options: TGetOptions): Promise<EnterpriseLogicQueryMessage<TModel[]>>
    async getOne?<TGetOptions>(options: TGetOptions): Promise<EnterpriseLogicQueryMessage<TModel>>

    async save?<TSaveOptions>(options: TSaveOptions): Promise<EnterpriseLogicQueryMessage<any>>

    async delete?<TDeleteOptions>(options: TDeleteOptions): Promise<EnterpriseLogicQueryMessage<any>>

    validate?(model: TModel): boolean | Promise<boolean>
}