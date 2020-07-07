import { IApiRequestOptions } from "../../src/api/provider/api-request-options.interface";

export interface GetSimpleString{
    search?:string
}

export const getSimpleStringRequestOptions:IApiRequestOptions={
    url:'simple',
    validationRules:[]
}