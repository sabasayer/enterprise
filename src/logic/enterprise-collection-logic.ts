import { IEnterpriseCollectionLogic } from "./enterprise-collection-logic.interface";
import { EnterpirseLogic } from "./enterpise-logic";
import { IApiResponse, EnterpriseApi } from "@/api";
import { IValidationResult } from ".";
import { ExtendArray, UuidUtil } from "@sabasayer/utils";
import { EnterpriseCollectionProvider } from "@/data-house";

new ExtendArray();

export class EnterpriseCollectionLogic<TModel> extends EnterpirseLogic
    implements IEnterpriseCollectionLogic<TModel> {
    protected provider: EnterpriseCollectionProvider<TModel>;

    constructor(provider: EnterpriseCollectionProvider<TModel>) {
        super();
        this.provider = provider;
    }

    async get?<TGetRequest>(
        request: TGetRequest,
        cancelTokenUniqueKey?: string
    ): Promise<IApiResponse<TModel[]>>;

    async getOne<TGetRequest>(
        request: TGetRequest,
        cancelTokenUniqueKey?: string
    ): Promise<IApiResponse<TModel>> {
        if (!this.get) throw new Error("get method is not defined!");

        const result = await this.get(request, cancelTokenUniqueKey);

        if (result.errorMessages || result.canceled)
            return {
                canceled: result.canceled,
                errorMessages: result.errorMessages,
            };

        return {
            data: result.data?.[0],
        };
    }

    validate?(model: TModel): IValidationResult | Promise<IValidationResult>;

    async validateMany(models: TModel[]): Promise<IValidationResult> {
        if (!this.validate) throw new Error("validate method is not defined");

        let validationResult: IValidationResult = {
            valid: true,
            errorMessages: {},
        };

        await models.forEachAsync(async (model) => {
            const result = await this.validate?.(model);
            if (!result?.valid) validationResult.valid = false;

            if (result?.errorMessages) {
                const id = this.provider.getIdFromItem(model);

                let key = id ? id + "" : UuidUtil.uuidv4();

                validationResult.errorMessages![key] = result.errorMessages;
            }
        });

        return validationResult;
    }
}
