import { EnterpriseCollectionProvider } from "../../../../src/data-house";
import {
    OrderLaboratoryModel,
    GetLaboratoryOrdersRequest,
    getLaboratoryOrdersRequestOptions,
    saveLaboratoryOrdersRequestOptions,
    deleteLaboratoryOrdersRequestOptions,
    SaveLaboratoryOrdersRequest,
    DeleteLaboratoryOrdersRequest,
} from "./laboratory-order.api";
import { EnterpriseApi } from "../../../../src/api";

export class LaboratoryOrderCollectionProvider extends EnterpriseCollectionProvider<
    OrderLaboratoryModel,
    SaveLaboratoryOrdersRequest,
    SaveLaboratoryOrdersRequest,
    DeleteLaboratoryOrdersRequest,
    DeleteLaboratoryOrdersRequest
> {
    constructor(api: EnterpriseApi) {
        super(api, {
            typename: "laboratory-order",
            getRequestOptions: getLaboratoryOrdersRequestOptions,
            saveRequestOptions: saveLaboratoryOrdersRequestOptions,
            deleteRequestOptions: deleteLaboratoryOrdersRequestOptions,
            idField: "id",
        });
    }

    async get(request: GetLaboratoryOrdersRequest) {
        return super.get(request);
    }
}
