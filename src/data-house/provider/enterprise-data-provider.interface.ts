import { IServiceRequestOptions } from "./service-request-options.interface";

export interface IEnterpriseDataProvider<TModel> {

    apiRequest?: <TRequestModel, TResponseModel>(options: IServiceRequestOptions<TRequestModel>) => Promise<TResponseModel | undefined>
}