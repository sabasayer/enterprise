import { EnterpriseCollectionProvider } from "@/data-house/collection/enterprise-collection-provider";
import { IApiResponse } from "@/api/provider/api-response.interface";
import { IValidationResponse } from "./validation-response.interface";

export interface IEnterpriseCollectionLogic<TModel> {
    provider?: EnterpriseCollectionProvider<TModel>;

    get?: (options: object) => Promise<IApiResponse<TModel[]>>
    getOne?: (options: object) => Promise<IApiResponse<TModel>>
    save?: <TSaveResult>(options: object) => Promise<IApiResponse<TSaveResult>>
    delete?: <TDeleteResult>(options: object) => Promise<IApiResponse<TDeleteResult>>
    validate?: (model: TModel) => IValidationResponse | Promise<IValidationResponse>
    validateMany?: (models: TModel[]) => IValidationResponse | Promise<IValidationResponse>
    mapToVm?: <TViewModel>(model: TModel) => TViewModel
}