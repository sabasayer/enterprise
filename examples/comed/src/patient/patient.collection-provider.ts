import {
    EnterpriseCollectionProvider,
    GetCollectionOptions,
} from "../../../../src/data-house";
import {
    PatientModel,
    getPatientRequestOptions,
    GetPatientRequest,
} from "./patient.api";
import { EnterpriseApi } from "../../../../src/api";

export class PatientCollectionProvider extends EnterpriseCollectionProvider<
    PatientModel,
    GetPatientRequest
> {
    constructor(api: EnterpriseApi) {
        super(api, {
            typename: "patient",
            getRequestOptions: getPatientRequestOptions,
            idField: "id",
        });
    }
}
