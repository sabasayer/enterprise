import { EnterpriseLogicQueryMessage } from "./enterprise-logic-query-message";
import { IApiResponse } from "../api/provider/api-response.interface";
import { EnterpriseCollectionProvider } from "../data-house/collection/enterprise-collection-provider";
import { IValidationResponse } from "./validation-response.interface";

export interface IEnterpriseCollectionLogic<TModel> {
    provider?: EnterpriseCollectionProvider<TModel>;

    get?: (options: object) => Promise<IApiResponse<TModel[]>>
    getOne?: (options: object) => Promise<IApiResponse<TModel>>
    save?: (options: object) => Promise<IApiResponse<any>>
    delete?: (options: object) => Promise<IApiResponse<any>>
    validate?: (model: TModel) => IValidationResponse | Promise<IValidationResponse>
    mapToVm?: (model: TModel) => object
}