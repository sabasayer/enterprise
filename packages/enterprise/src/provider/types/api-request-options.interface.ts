import { IApiValidationRule } from "./api-request-validation-rule.interface";
import { EnumRequestMethod } from "../../api/enums/request-method.enum";

export interface IApiRequestOptions{
    url:string,
    validationRules?:IApiValidationRule[],
    method?: EnumRequestMethod,
}