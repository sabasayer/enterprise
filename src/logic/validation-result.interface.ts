import { ErrorMessages } from "@/shared/definitions/error-messages.interface";

export interface IValidationResult{
    valid:boolean
    errorMessages?:ErrorMessages
}