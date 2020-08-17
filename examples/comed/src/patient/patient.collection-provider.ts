
import {
    PatientModel,
    getPatientRequestOptions,
    GetPatientRequest,
} from "./patient.api";
import { EnumCacheType } from "@sabasayer/utils";
import { EnterpriseCollectionProvider, EnterpriseApi, EnumProvideFromCacheStrategy } from "../../../../dist";

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
