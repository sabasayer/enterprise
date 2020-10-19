import {
    PatientModel,
    getPatientRequestOptions,
    GetPatientRequest,
} from "./patient.api";
import { EnumCacheType } from "@sabasayer/utils";
import {
    EnterpriseCollectionProvider,
    EnumProvideFromCacheStrategy,
} from "../../../../src/data-house";
import { IEnterpriseApi } from "../../../../src/api";

export class PatientCollectionProvider extends EnterpriseCollectionProvider<
    PatientModel,
    GetPatientRequest
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
