import { EnterpriseCollectionProvider } from "../../src/data-house/collection/enterprise-collection-provider";
import { Patient } from "./patient";
import { EnumCacheType } from "@sabasayer/utils";
import { EnumProvideFromCacheStrategy } from "../../src/data-house/collection/enums/provide-from-cache-strategy.enum";
import { GetPatientRequest, getPatientRequestOptions, savePatientsRequestOptions, deletePatientsRequestOptions, SavePatientsRequest } from "./patient.api";
import { GetFromCacheCollectionOptions } from "../../src/data-house/collection/get-from-cache-collection.options";
import { EnterpriseApi } from "../..";

export class PatientCollectionProvider extends EnterpriseCollectionProvider<Patient> {
    static instance: PatientCollectionProvider;

    constructor(api: EnterpriseApi) {
        super(api, {
            typename: "patient",
            cacheStrategy: EnumCacheType.SessionStorage,
            idField: "id",
            provideFromCacheStrategy: EnumProvideFromCacheStrategy.CollectionId,
            getRequestOptions: getPatientRequestOptions,
            saveRequestOptions: savePatientsRequestOptions,
            deleteRequestOptions:deletePatientsRequestOptions,
            isEndpointRest: true
        });
    }

    async get(
        getRequest: GetPatientRequest,
        getOptions?: GetFromCacheCollectionOptions
    ) {
        return super.get(getRequest, getOptions);
    }

}


