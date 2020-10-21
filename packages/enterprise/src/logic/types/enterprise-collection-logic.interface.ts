import { IEnterpriseSubscription } from "../../data-house";
import { GetCollectionOptions, IApiResponse } from "../../provider";
import { IValidationResult } from "..";

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

    /**
     * Runs before get method. Get method uses this methods return value
     * @param request get method parameters.
     */
    beforeGet?(request: TGetRequest): TGetRequest | Promise<TGetRequest>;

    get(
        request: TGetRequest,
        getOptions?: GetCollectionOptions<TModel>
    ): Promise<IApiResponse<(TViewModel extends undefined ? TModel : TViewModel)[]>>;
    getOne(
        request: TGetRequest,
        getOptions?: GetCollectionOptions<TModel>
    ): Promise<IApiResponse<TViewModel extends undefined ? TModel : TViewModel>>;

    /**
     * Runs after get method
     * @param result get method result
     */
    afterGet?(
        result: IApiResponse<(TViewModel extends undefined ? TModel : TViewModel)[]>
    ): void | Promise<void>;

    validate?(
        model: TViewModel extends undefined ? TModel : TViewModel
    ): IValidationResult | Promise<IValidationResult>;

    validateMany(models: (TViewModel extends undefined ? TModel : TViewModel)[]): Promise<IValidationResult>;

    getIdFromItem(model: TViewModel extends undefined ? TModel : TViewModel): any;

    /**
     * Runs before save - before validation. Save method uses this methods return value
     * @param models save method parameters.
     */
    beforeSave?(
        models: (TViewModel extends undefined ? TModel : TViewModel)[]
    ):
        | (TViewModel extends undefined ? TModel : TViewModel)[]
        | Promise<(TViewModel extends undefined ? TModel : TViewModel)[]>;

    saveOne(
        model: TViewModel extends undefined ? TModel : TViewModel,
        createSaveRequest: (model: TModel) => TSaveRequest
    ): Promise<IApiResponse<TSaveResponse>>;

    save(
        models: (TViewModel extends undefined ? TModel : TViewModel)[],
        createSaveRequest: (models: TModel[]) => TSaveRequest
    ): Promise<IApiResponse<TSaveResponse>>;

    /**
     * Runs after save
     * @param result save method result
     */
    afterSave?(result: IApiResponse<TSaveResponse>): void | Promise<void>;

    /**
     * Runs before delete
     * @param options delete method parameter
     */
    beforeDelete?(options: TDeleteRequest): TDeleteRequest | Promise<TDeleteRequest>;

    delete(options: TDeleteRequest): Promise<IApiResponse<TDeleteResponse>>;

    /**
     * Runs after delete
     * @param options delete method result
     */
    afterDelete?(options: IApiResponse<TDeleteResponse>): void | Promise<void>;
}
