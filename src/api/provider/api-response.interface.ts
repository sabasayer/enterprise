import { ErrorMessages } from "@/shared/definitions/error-messages.interface";

export interface IApiResponse<TModel = undefined> {
    errorMessages?: ErrorMessages;
    data?: TModel;
    canceled?: boolean
}
