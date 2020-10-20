import { IApiRequestOptions } from "@sabasayer/enterprise";

export interface GetSimpleString{
    search?:string
}

export const getSimpleStringRequestOptions:IApiRequestOptions={
    url:'simple',
    validationRules:[]
}