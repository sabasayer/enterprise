import { IApiValidationRule } from "./api-request-validation-rule.interface";
import { EnumRequestMethod } from "../../api/enums/request-method.enum";
import { IApiRequestValidationResult } from "..";

export interface IApiRequestOptions<TResponse = undefined>{
    url:string,
    validationRules?:IApiValidationRule[],
    method?: EnumRequestMethod,
    responseValidationFn?:(response?:TResponse) => IApiRequestValidationResult
}