export interface IApiResponse<TModel> {
    error: boolean;
    errorMessages?: Record<string, string>;
    data?: TModel;
}
