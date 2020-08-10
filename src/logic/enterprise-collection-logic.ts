import { IEnterpriseCollectionLogic } from "./enterprise-collection-logic.interface";
import { EnterpriseLogic } from "./enterprise-logic";
import { IApiResponse, EnterpriseApi } from "../api";
import { IValidationResult } from ".";
import { ExtendArray, UuidUtil } from "@sabasayer/utils";
import {
    EnterpriseCollectionProvider,
    GetCollectionOptions,
} from "../data-house";
import { EnterpriseMapper } from "../mapper";

new ExtendArray();

export class EnterpriseCollectionLogic<
    TModel,
    TCollectionProvider extends EnterpriseCollectionProvider<TModel>,
    TViewModel = undefined
> extends EnterpriseLogic {
    protected provider: TCollectionProvider;
    protected mapper?: EnterpriseMapper<TModel, TViewModel>;

    constructor(
        api: EnterpriseApi,
        provider: { new (api: EnterpriseApi): TCollectionProvider },
        mapper?: { new (): EnterpriseMapper<TModel, TViewModel> }
    ) {
        super();
        this.provider = new provider(api);
        if (mapper) this.mapper = new mapper();
    }

    async get?<TGetRequest>(
        request: TGetRequest,
        getOptions?: GetCollectionOptions
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

    async getOne<TGetRequest>(
        request: TGetRequest,
        getOptions?: GetCollectionOptions
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
                // const id = this.provider.getIdFromItem(model);

                let key = UuidUtil.uuidv4();

                validationResult.errorMessages![key] = result.errorMessages;
            }
        });

        return validationResult;
    }

    async save?<TSaveResult>(
        model: TViewModel extends undefined ? TModel : TViewModel,
        createSaveRequest: (model: TModel) => object
    ): Promise<IApiResponse<TSaveResult>> {
        if (this.validate) {
            const validationResult = await this.validate(model);

            if (!validationResult.valid) {
                return {
                    errorMessages: validationResult.errorMessages,
                };
            }
        }

        if (this.mapper) {
            const mappedModel = this.mapper.mapToModel(model as TViewModel);
            return this.provider.save(createSaveRequest(mappedModel));
        }

        return this.provider.save(createSaveRequest(model as TModel));
    }

    async saveMany?<TSaveManyResult>(
        models: (TViewModel extends undefined ? TModel : TViewModel)[],
        createSaveRequest: (models: TModel[]) => object
    ): Promise<IApiResponse<TSaveManyResult>> {
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

    delete?: <TDeleteResult>(
        options: any
    ) => Promise<IApiResponse<TDeleteResult>>;
    deleteMany?: <TDeleteManyResult>(
        options: any
    ) => Promise<IApiResponse<TDeleteManyResult>>;
}
