import {
    PatientModel,
    getPatientRequestOptions,
    GetPatientRequest,
    SavePatientServiceRequest,
} from "./patient.api";
import { EnumCacheType } from "@sabasayer/utils";
import {
    EnterpriseCollectionProvider,
    EnumProvideFromCacheStrategy,
} from "@sabasayer/enterprise";
import { IEnterpriseApi } from "@sabasayer/enterprise";

export class PatientCollectionProvider extends EnterpriseCollectionProvider<
    PatientModel,
    GetPatientRequest,
    SavePatientServiceRequest
> {
    constructor(api: IEnterpriseApi) {
        super(api, {
            typename: "patient",
            getRequestOptions: getPatientRequestOptions,
            idField: "id",
            cacheStrategy: EnumCacheType.Memory,
            provideFromCacheStrategy: EnumProvideFromCacheStrategy.CollectionId,
        });


    }
}
