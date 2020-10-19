import { EnterpriseCollectionProvider } from "../../src/data-house/collection/enterprise-collection-provider";
import { Patient } from "./patient";
import { EnumCacheType } from "@sabasayer/utils";
import { EnumProvideFromCacheStrategy } from "../../src/data-house/collection/enums/provide-from-cache-strategy.enum";
import {
    GetPatientRequest,
    getPatientRequestOptions,
    savePatientsRequestOptions,
    deletePatientsRequestOptions,
    SavePatientsRequest,
    DeletePatientsRequest,
} from "./patient.api";
import { EnterpriseApi, GetCollectionOptions } from "../..";
import { IEnterpriseApi } from "../../src/api";

export class PatientCollectionProvider extends EnterpriseCollectionProvider<
    Patient,
    GetPatientRequest,
    SavePatientsRequest,
    Patient[],
    DeletePatientsRequest,
    Patient[]
> {
    static instance: PatientCollectionProvider;

    constructor(api: IEnterpriseApi) {
        super(api, {
            typename: "patient",
            cacheStrategy: EnumCacheType.Memory,
            idField: "id",
            provideFromCacheStrategy: EnumProvideFromCacheStrategy.CollectionId,
            getRequestOptions: getPatientRequestOptions,
            saveRequestOptions: savePatientsRequestOptions,
            deleteRequestOptions: deletePatientsRequestOptions,
        });
    }

    async get(
        getRequest: GetPatientRequest,
        getOptions?: GetCollectionOptions
    ) {
        return super.get(getRequest, getOptions);
    }
}
