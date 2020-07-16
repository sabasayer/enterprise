import { IApiValidationRule } from "./api-request-validation-rule.interface";
import { EnumRequestMethod } from "../enums/request-method.enum";

export interface IApiRequestOptions{
    url:string,
    validationRules?:IApiValidationRule[],
    method?: EnumRequestMethod,
}