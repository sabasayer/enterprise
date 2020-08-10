import { EnterpriseCollectionLogic } from "../../../../src/logic";
import {
    OrderLaboratoryModel,
    GetLaboratoryOrdersRequest,
    SaveLaboratoryOrdersRequest,
    DeleteLaboratoryOrdersRequest,
} from "./laboratory-order.api";
import { LaboratoryOrderCollectionProvider } from "./laboratory-order.collection-provider";
import { EnterpriseApi, IApiResponse } from "../../../../src/api";

export class LaboratoryOrderLogic extends EnterpriseCollectionLogic<
    OrderLaboratoryModel,
    LaboratoryOrderCollectionProvider
> {
    static instance: LaboratoryOrderLogic;

    constructor(api: EnterpriseApi) {
        super(api, LaboratoryOrderCollectionProvider);
    }

    async get(options: GetLaboratoryOrdersRequest) {
        return super.get(options);
    }

    async save(
        model: OrderLaboratoryModel
    ): Promise<IApiResponse<OrderLaboratoryModel[]>> {
        return super.save(model, (e) => ({
            orders: [model],
        }));
    }

    async deleteMany(
        options: DeleteLaboratoryOrdersRequest
    ): Promise<IApiResponse<DeleteLaboratoryOrdersRequest>> {
        return super.deleteMany(options);
    }

    async delete(options: { id: number; comment: string }) {
        const result = this.deleteMany({
            orders: { [options.id]: options.comment },
        });

        return result;
    }
}
