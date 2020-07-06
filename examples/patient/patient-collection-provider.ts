import { EnterpriseCollectionProvider } from "../../src/data-house/collection/enterprise-collection-provider";
import { Patient } from "./patient";
import { EnumCacheType } from "@sabasayer/utils";
import { EnumProvideFromCacheStrategy } from "../../src/data-house/collection/enums/provide-from-cache-strategy.enum";
import { GetPatientRequest, getPatientRequestOptions } from "./patient.api";
import { GetFromCacheCollectionOptions } from "../../src/data-house/collection/get-from-cache-collection.options";
import { EnterpriseApi } from "../..";
import { api } from "./main";

export class PatientCollectionProvider extends EnterpriseCollectionProvider<Patient> {
    constructor(api:EnterpriseApi) {
        super(api, {
            typename: "patient",
            cacheStrategy: EnumCacheType.SessionStorage,
            idField: "id",
            provideFromCacheStrategy: EnumProvideFromCacheStrategy.CollectionId,
            getRequestOptions: getPatientRequestOptions,
            isEndpointRest:true
        });
    }

    async get(
        getRequest: GetPatientRequest,
        getOptions?: GetFromCacheCollectionOptions
    ) {
        return super.get(getRequest, getOptions);
    }
}


