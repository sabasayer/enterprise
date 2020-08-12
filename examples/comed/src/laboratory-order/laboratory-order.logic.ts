import {
    EnterpriseCollectionLogic,
    IValidationResult,
} from "../../../../src/logic";
import {
    OrderLaboratoryModel,
    GetLaboratoryOrdersRequest,
    SaveLaboratoryOrdersRequest,
    DeleteLaboratoryOrdersRequest,
    SaveLaboratoryOrderResponse,
    DeleteLaboratoryOrdersResponse,
} from "./laboratory-order.api";
import { LaboratoryOrderCollectionProvider } from "./laboratory-order.collection-provider";
import { EnterpriseApi, IApiResponse } from "../../../../src/api";

export class LaboratoryOrderLogic extends EnterpriseCollectionLogic<
    OrderLaboratoryModel,
    LaboratoryOrderCollectionProvider,
    GetLaboratoryOrdersRequest,
    undefined,
    SaveLaboratoryOrdersRequest,
    SaveLaboratoryOrderResponse,
    DeleteLaboratoryOrdersRequest,
    DeleteLaboratoryOrdersResponse
> {
    static instance: LaboratoryOrderLogic;

    constructor(api: EnterpriseApi) {
        super(api, LaboratoryOrderCollectionProvider);
    }

    validate(model: OrderLaboratoryModel): IValidationResult {
        if (!model.location)
            return {
                valid: false,
                errorMessages: {
                    location: "location is required",
                },
            };

        return { valid: true };
    }

    async save(models: OrderLaboratoryModel[]) {
        return super.save(models, (orders) => ({ orders }));
    }

    async saveOne(model: OrderLaboratoryModel) {
        return super.saveOne(model, (model) => ({ orders: [model] }));
    }

    // async get(options: GetLaboratoryOrdersRequest) {
    //     return super.get(options);
    // }

    // async save(
    //     model: OrderLaboratoryModel
    // ): Promise<IApiResponse<OrderLaboratoryModel[]>> {
    //     return super.save(model, (e) => ({
    //         orders: [model],
    //     }));
    // }

    // async deleteMany(
    //     options: DeleteLaboratoryOrdersRequest
    // ): Promise<IApiResponse<DeleteLaboratoryOrdersRequest>> {
    //     return super.deleteMany(options);
    // }

    // async delete(options: { id: number; comment: string }) {
    //     const result = this.deleteMany({
    //         orders: { [options.id]: options.comment },
    //     });

    //     return result;
    // }
}


LaboratoryOrderLogic.register()