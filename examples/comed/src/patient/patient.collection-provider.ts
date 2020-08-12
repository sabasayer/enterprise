import {
    EnterpriseCollectionProvider,
    GetCollectionOptions,
    EnumProvideFromCacheStrategy,
} from "../../../../src/data-house";
import {
    PatientModel,
    getPatientRequestOptions,
    GetPatientRequest,
} from "./patient.api";
import { EnterpriseApi } from "../../../../src/api";
import { EnumCacheType } from "@sabasayer/utils";

export class PatientCollectionProvider extends EnterpriseCollectionProvider<
    PatientModel,
    GetPatientRequest
> {
    constructor(api: EnterpriseApi) {
        super(api, {
            typename: "patient",
            getRequestOptions: getPatientRequestOptions,
            idField: "id",
            cacheStrategy: EnumCacheType.Memory,
            provideFromCacheStrategy: EnumProvideFromCacheStrategy.CollectionId,
        });
    }
}
