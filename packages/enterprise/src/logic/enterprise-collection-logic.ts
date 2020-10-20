import { EnterpriseLogic } from "./enterprise-logic";
import { IEnterpriseApi, ServiceRequest } from "../api";
import { IValidationResult } from ".";
import { ExtendArray, UuidUtil } from "@sabasayer/utils";
import { IEnterpriseSubscription } from "../data-house";
import { EnterpriseMapper } from "../mapper";
import {
    ExtractGetRequest,
    ExtractSaveRequest,
    ExtractDeleteRequest,
    EnterpriseCollectionProvider,
    ExtractDeleteResponse,
    ExtractSaveResponse,
    GetCollectionOptions,
    IApiResponse,
} from "../../index";
import { IEnterpriseCollectionLogic } from "./enterprise-collection-logic.interface";

new ExtendArray();

export class EnterpriseCollectionLogic<
        TModel,
        TCollectionProvider extends EnterpriseCollectionProvider<
            TModel,
            TGetRequest,
            ServiceRequest<TSaveRequest, TSaveResponse>,
            ServiceRequest<TDeleteRequest, TDeleteResponse>
        >,
        TViewModel = undefined,
        TGetRequest = ExtractGetRequest<TCollectionProvider>,
        TSaveRequest = ExtractSaveRequest<TCollectionProvider>,
        TSaveResponse = ExtractSaveResponse<TCollectionProvider>,
        TDeleteRequest = ExtractDeleteRequest<TCollectionProvider>,
        TDeleteResponse = ExtractDeleteResponse<TCollectionProvider>
    >
    extends EnterpriseLogic
    implements
        IEnterpriseCollectionLogic<
            TModel,
            TViewModel,
            TGetRequest,
            TSaveRequest,
            TSaveResponse,
            TDeleteRequest,
            TDeleteResponse
        > {
    protected provider: TCollectionProvider;
    protected mapper?: EnterpriseMapper<TModel, TViewModel>;
    protected vmIdField?: keyof TViewModel;

    constructor(
        api: IEnterpriseApi,
        provider: { new (api: IEnterpriseApi): TCollectionProvider },
        mapper?: { new (): EnterpriseMapper<TModel, TViewModel> },
        vmIdField?: keyof TViewModel
    ) {
        super();
        this.provider = new provider(api);
        this.vmIdField = vmIdField;
        if (mapper) this.mapper = new mapper();
    }

    subscribe(options: IEnterpriseSubscription<TModel>) {
        this.provider.subscribe(options);
    }

    unsubscribe(id: string) {
        this.provider.unsubscribe(id);
    }

    async get(
        request: TGetRequest,
        getOptions?: GetCollectionOptions<TModel>
    ): Promise<
        IApiResponse<(TViewModel extends undefined ? TModel : TViewModel)[]>
    > {
        const result = await this.provider.get(request, getOptions);
        if (result.canceled || result.errorMessages)
            return {
                canceled: result.canceled,
                errorMessages: result.errorMessages,
            };

        if (this.mapper) {
            const mappedValues = this.mapper.mapListToVm(result.data);
            return {
                data: mappedValues as (TViewModel extends undefined
                    ? TModel
                    : TViewModel)[],
            };
        }

        return {
            data: result.data as (TViewModel extends undefined
                ? TModel
                : TViewModel)[],
        };
    }

    async getOne(
        request: TGetRequest,
        getOptions?: GetCollectionOptions<TModel>
    ): Promise<
        IApiResponse<TViewModel extends undefined ? TModel : TViewModel>
    > {
        if (!this.get) throw new Error("get method is not defined!");

        const result = await this.get(request, getOptions);

        if (result.errorMessages || result.canceled)
            return {
                canceled: result.canceled,
                errorMessages: result.errorMessages,
            };

        return {
            data: result.data?.[0],
        };
    }

    validate?(
        model: TViewModel extends undefined ? TModel : TViewModel
    ): IValidationResult | Promise<IValidationResult>;

    async validateMany(
        models: (TViewModel extends undefined ? TModel : TViewModel)[]
    ): Promise<IValidationResult> {
        if (!this.validate) throw new Error("validate method is not defined");

        let validationResult: IValidationResult = {
            valid: true,
            errorMessages: {},
        };

        await models.forEachAsync(async (model) => {
            const result = await this.validate?.(model);
            if (!result?.valid) validationResult.valid = false;

            if (result?.errorMessages) {
                let key = UuidUtil.uuidv4();

                const id = this.getIdFromItem(model);

                if (id != undefined) key = id + "";

                validationResult.errorMessages![key] = result.errorMessages;
            }
        });

        return validationResult;
    }

    getIdFromItem(model: TViewModel extends undefined ? TModel : TViewModel) {
        if (this.vmIdField) return (model as TViewModel)[this.vmIdField];
        else return this.provider.getIdFromItem(model as TModel);
    }

    async saveOne(
        model: TViewModel extends undefined ? TModel : TViewModel,
        createSaveRequest: (model: TModel) => TSaveRequest
    ): Promise<IApiResponse<TSaveResponse>> {
        const result = await this.save([model], (models) =>
            createSaveRequest(models[0])
        );

        if (result.canceled || result.errorMessages)
            return {
                canceled: result.canceled,
                errorMessages: result.errorMessages,
            };

        return {
            data: result.data,
        };
    }

    async save(
        models: (TViewModel extends undefined ? TModel : TViewModel)[],
        createSaveRequest: (models: TModel[]) => TSaveRequest
    ): Promise<IApiResponse<TSaveResponse>> {
        if (this.validate) {
            const validationResult = await this.validateMany(models);
            if (!validationResult.valid)
                return { errorMessages: validationResult.errorMessages };
        }

        if (this.mapper) {
            const mappedModels = this.mapper.mapListToModel(
                models as TViewModel[]
            );
            return this.provider.save(createSaveRequest(mappedModels));
        }

        return this.provider.save(createSaveRequest(models as TModel[]));
    }

    async delete(
        options: TDeleteRequest
    ): Promise<IApiResponse<TDeleteResponse>> {
        return this.provider.delete(options);
    }
}
