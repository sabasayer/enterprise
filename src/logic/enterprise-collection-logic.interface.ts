import { EnterpriseCollectionProvider } from "@/data-house/collection/enterprise-collection-provider";
import { IApiResponse } from "@/api/provider/api-response.interface";
import { IValidationResponse } from "./validation-response.interface";

export interface IEnterpriseCollectionLogic<TModel> {
    provider?: EnterpriseCollectionProvider<TModel>;

    get?: (options: object) => Promise<IApiResponse<TModel[]>>
    getOne?: (options: object) => Promise<IApiResponse<TModel>>
    save?: <TSaveResult>(options: object) => Promise<IApiResponse<TSaveResult>>
    saveMany?: <TSaveManyResult>(options: object) => Promise<IApiResponse<TSaveManyResult>>
    delete?: <TDeleteResult>(options: object) => Promise<IApiResponse<TDeleteResult>>
    deleteMany?: <TDeleteManyResult>(options: object) => Promise<IApiResponse<TDeleteManyResult>>
    validate?: (model: TModel) => IValidationResponse | Promise<IValidationResponse>
    validateMany?: (models: TModel[]) => IValidationResponse | Promise<IValidationResponse>
    mapToVm?: <TViewModel>(model: TModel) => TViewModel
}