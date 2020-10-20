import { EnterpriseCollectionProvider } from "@sabasayer/enterprise";
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
import { IEnterpriseApi } from "@sabasayer/enterprise";

export class LaboratoryOrderCollectionProvider extends EnterpriseCollectionProvider<
    OrderLaboratoryModel,
    GetLaboratoryOrdersRequest,
    SaveLaboratoryOrdersRequest,
    SaveLaboratoryOrderResponse,
    DeleteLaboratoryOrdersRequest,
    DeleteLaboratoryOrdersResponse
> {
    constructor(api: IEnterpriseApi) {
        super(api, {
            typename: "laboratory-order",
            getRequestOptions: getLaboratoryOrdersRequestOptions,
            saveRequestOptions: saveLaboratoryOrdersRequestOptions,
            deleteRequestOptions: deleteLaboratoryOrdersRequestOptions,
            idField: "id",
        });
    }
}
