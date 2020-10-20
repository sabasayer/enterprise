import { IApiResponse } from "./api-response.interface";
import { CancelTokenSource } from "axios";

export interface ICancellableApiResponse<TModel> {
    response: Promise<IApiResponse<TModel>>,
    token: CancelTokenSource
}