import { EnterpriseCollectionProvider } from "../../../../src/data-house";
import {
    OrderLaboratoryModel,
    GetLaboratoryOrdersRequest,
    getLaboratoryOrdersRequestOptions,
    saveLaboratoryOrdersRequestOptions,
    deleteLaboratoryOrdersRequestOptions,
    SaveLaboratoryOrdersRequest,
    SaveLaboratoryOrderResponse,
    DeleteLaboratoryOrdersRequest,
    DeleteLaboratoryOrdersResponse,
} from "./laboratory-order.api";
import { EnterpriseApi } from "../../../../src/api";

export class LaboratoryOrderCollectionProvider extends EnterpriseCollectionProvider<
    OrderLaboratoryModel,
    GetLaboratoryOrdersRequest,
    SaveLaboratoryOrdersRequest,
    SaveLaboratoryOrderResponse,
    DeleteLaboratoryOrdersRequest,
    DeleteLaboratoryOrdersResponse
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
}