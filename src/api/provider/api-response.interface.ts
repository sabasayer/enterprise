import { ErrorMessages } from "@/shared/definitions/error-messages.interface";

export interface IApiResponse<TModel> {
    errorMessages?: ErrorMessages;
    data?: TModel;
}
