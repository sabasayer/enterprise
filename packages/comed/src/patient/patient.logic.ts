import { EnterpriseApi } from "@sabasayer/enterprise";
import { EnterpriseCollectionLogic } from "@sabasayer/enterprise";
import { PatientModel, GetPatientRequest, Patient } from "./patient.api";
import { PatientCollectionProvider } from "./patient.collection-provider";
import { PatientMapper } from "./patient.mapper";

export class PatientLogic extends EnterpriseCollectionLogic<
    PatientModel,
    PatientCollectionProvider,
    Patient
> {
    static instance: PatientLogic;

    constructor(api: EnterpriseApi) {
        super(api, PatientCollectionProvider, PatientMapper);
    }

    async getOne(request: GetPatientRequest) {
        return super.getOne(request, { ids: request.keys });
    }
}

PatientLogic.register();