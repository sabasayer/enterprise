import { IEnterpriseApiValidationRule } from "./enterprise-api-validation-rule.interface";

export interface IServiceRequestOptions<TRequestModel>{
    url:string,
    requestModel?:TRequestModel,
    validationRules?:IEnterpriseApiValidationRule[]
}