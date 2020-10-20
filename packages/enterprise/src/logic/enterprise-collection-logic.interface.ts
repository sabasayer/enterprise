import { IEnterpriseSubscription } from "../data-house";
import { GetCollectionOptions, IApiResponse } from "../provider";
import { IValidationResult } from ".";

export interface IEnterpriseCollectionLogic<
    TModel,
    TViewModel = undefined,
    TGetRequest = undefined,
    TSaveRequest = undefined,
    TSaveResponse = undefined,
    TDeleteRequest = undefined,
    TDeleteResponse = undefined
> {
    subscribe(options: IEnterpriseSubscription<TModel>): void;

    unsubscribe(id: string): void;

    get(
        request: TGetRequest,
        getOptions?: GetCollectionOptions<TModel>
    ): Promise<
        IApiResponse<(TViewModel extends undefined ? TModel : TViewModel)[]>
    >;
    getOne(
        request: TGetRequest,
        getOptions?: GetCollectionOptions<TModel>
    ): Promise<
        IApiResponse<TViewModel extends undefined ? TModel : TViewModel>
    >;

    validate?(
        model: TViewModel extends undefined ? TModel : TViewModel
    ): IValidationResult | Promise<IValidationResult>;

    validateMany(
        models: (TViewModel extends undefined ? TModel : TViewModel)[]
    ): Promise<IValidationResult>;

    getIdFromItem(
        model: TViewModel extends undefined ? TModel : TViewModel
    ): any;

    saveOne(
        model: TViewModel extends undefined ? TModel : TViewModel,
        createSaveRequest: (model: TModel) => TSaveRequest
    ): Promise<IApiResponse<TSaveResponse>>;

    save(
        models: (TViewModel extends undefined ? TModel : TViewModel)[],
        createSaveRequest: (models: TModel[]) => TSaveRequest
    ): Promise<IApiResponse<TSaveResponse>>;

    delete(options: TDeleteRequest): Promise<IApiResponse<TDeleteResponse>>;
}
