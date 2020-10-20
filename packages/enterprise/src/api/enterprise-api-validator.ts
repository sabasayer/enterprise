import { IApiRequestValidationResult } from "../provider/types/api-request-validation-result.interface";
import { IApiValidationRule } from "../provider/types/api-request-validation-rule.interface";

type IValidateRequest = <TRequest>(
    validationRules: IApiValidationRule[],
    request: TRequest
) => IApiRequestValidationResult;

export const validateRequest: IValidateRequest = <TRequest>(
    validationRules: IApiValidationRule[],
    request: TRequest
) => {
    //TODO: implement validation
    return { valid: true };
};
