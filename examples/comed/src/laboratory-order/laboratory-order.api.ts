import { PlanModel } from "../order/plan-model.interface";
import { IApiRequestOptions, IApiResponse } from "../../../../src/api";

export interface GetLaboratoryOrdersRequest {
    model?: Partial<OrderLaboratoryModel>;
    search?: string;
    from?: string;
    to?: string;
}

export interface SaveLaboratoryOrdersRequest {
    orders: OrderLaboratoryModel[];
}

export interface SaveLaboratoryOrderResponse
    extends SaveLaboratoryOrdersRequest {}

export interface DeleteLaboratoryOrdersRequest {
    orders: { [id: number]: string };
}

export interface DeleteLaboratoryOrdersResponse {
    orders: { [id: number]: boolean };
}

export interface OrderLaboratoryModel {
    id: number;
    plan: PlanModel;
    testId: number;
    sampleAreaTypeId?: number;
    sampleAreaTypeDescription?: string;
    rationalLabTestDescription?: string;
    EK2A2Description?: string;
    location?: any;
}

export const getLaboratoryOrdersRequestOptions: IApiRequestOptions = {
    url: "laboratory/getOrders",
};

export const saveLaboratoryOrdersRequestOptions: IApiRequestOptions = {
    url: "laboratory/saveOrders",
};

export const deleteLaboratoryOrdersRequestOptions: IApiRequestOptions = {
    url: "laboratory/deleteOrders",
};
