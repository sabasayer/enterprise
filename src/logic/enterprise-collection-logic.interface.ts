import { EnterpriseCollectionProvider } from "@/data-house/collection/enterprise-collection-provider";
import { IApiResponse } from "@/api/provider/api-response.interface";
import { IValidationResult } from "./validation-result.interface";

export interface IEnterpriseCollectionLogic<
    TModel,
    TCollectionProvider extends EnterpriseCollectionProvider<TModel>
> {
    get?: (
        options: any,
        cancelTokenUniqueKey?: string
    ) => Promise<IApiResponse<TModel[]>>;

    getOne?: (
        options: any,
        cancelTokenUniqueKey?: string
    ) => Promise<IApiResponse<TModel>>;

    save?: <TSaveResult>(options: any) => Promise<IApiResponse<TSaveResult>>;
    saveMany?: <TSaveManyResult>(
        options: any
    ) => Promise<IApiResponse<TSaveManyResult>>;
    delete?: <TDeleteResult>(
        options: any
    ) => Promise<IApiResponse<TDeleteResult>>;
    deleteMany?: <TDeleteManyResult>(
        options: any
    ) => Promise<IApiResponse<TDeleteManyResult>>;
    validate?: (
        model: TModel
    ) => IValidationResult | Promise<IValidationResult>;
    validateMany?: (
        models: TModel[]
    ) => IValidationResult | Promise<IValidationResult>;
    mapToVm?: <TViewModel>(model: TModel) => TViewModel;
}
