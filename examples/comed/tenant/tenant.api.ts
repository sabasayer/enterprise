import { IApiRequestOptions } from "../../../src/api/provider/api-request-options.interface";

export interface GetTenantsRequest {

}

export interface TenantModel {
    id:number
    parent?: TenantModel
    parentId: number
    name: string
    applicationKey: string
}

export const getTenantsRequestOptions: IApiRequestOptions = {
    url: 'core/getTenants'
}