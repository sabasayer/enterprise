import { ErrorMessages } from "@/shared/definitions/error-messages.interface";

export interface IValidationResponse{
    valid:boolean
    errorMessages?:ErrorMessages
}