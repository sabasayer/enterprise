import { IApiValidationRule } from "./api-request-validation-rule.interface";

export interface IApiRequestOptions{
    url:string,
    validationRules?:IApiValidationRule[]
}