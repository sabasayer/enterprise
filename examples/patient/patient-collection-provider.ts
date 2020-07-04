import { EnterpriseCollectionProvider } from "../../src/data-house/collection/enterprise-collection-provider";
import { Patient } from "./patient";
import { EnumCacheType } from "@sabasayer/utils";
import { EnumProvideFromCacheStrategy } from "../../src/data-house/collection/enums/provide-from-cache-strategy.enum";
import { GetPatientRequest, getPatientRequestOptions } from "./patient.api";
import { api } from "./main";
import { IApiResponse } from "../../src/api/provider/api-response.interface";
import { GetCollectionOptions } from "../../src/data-house/collection/get-collection.options";

class PatientCollectionProvider extends EnterpriseCollectionProvider<Patient> {
    constructor() {
        super(api, {
            typename: "patient",
            cacheStrategy: EnumCacheType.SessionStorage,
            idField: "id",
            provideFromCacheStrategy: EnumProvideFromCacheStrategy.CollectionId,
        });
    }

    async get(
        getRequest: GetPatientRequest,
        getOptions?: GetCollectionOptions
    ) {
        return this.getHandler(getRequest, getOptions);
    }

    async getFromApi(
        request: GetPatientRequest
    ): Promise<IApiResponse<Patient[]>> {
        const validationResult = this.validateRequest(
            getPatientRequestOptions,
            request
        );

        if (!validationResult.valid) {
            return {
                error: true,
                errorMessages: validationResult.errorMessages,
            };
        }

        return this.post(getPatientRequestOptions.url, request);
    }
}

export const patientCollectionProvider = new PatientCollectionProvider();
