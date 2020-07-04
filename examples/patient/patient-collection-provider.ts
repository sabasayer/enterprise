import { EnterpriseCollectionProvider } from "../../src/data-house/collection/enterprise-collection-provider";
import { Patient } from "./patient";
import { EnumCacheType } from "@sabasayer/utils";
import { EnumProvideFromCacheStrategy } from "../../src/data-house/collection/enums/provide-from-cache-strategy.enum";
import { GetPatientRequest, getPatientRequestOptions } from "./patient.api";
import { api } from "./main";
import { GetFromCacheCollectionOptions } from "../../src/data-house/collection/get-from-cache-collection.options";

class PatientCollectionProvider extends EnterpriseCollectionProvider<Patient> {
    constructor() {
        super(api, {
            typename: "patient",
            cacheStrategy: EnumCacheType.SessionStorage,
            idField: "id",
            provideFromCacheStrategy: EnumProvideFromCacheStrategy.CollectionId,
            getRequestOptions: getPatientRequestOptions,
        });
    }

    async get(
        getRequest: GetPatientRequest,
        getOptions?: GetFromCacheCollectionOptions
    ) {
        return super.get(getRequest, getOptions);
    }
}

export const patientCollectionProvider = new PatientCollectionProvider();
