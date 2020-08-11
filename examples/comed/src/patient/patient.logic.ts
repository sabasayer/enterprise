import { EnterpriseCollectionLogic } from "../../../../src/logic";
import { PatientModel, GetPatientRequest, Patient } from "./patient.api";
import { PatientCollectionProvider } from "./patient.collection-provider";
import { EnterpriseApi, IApiResponse } from "../../../../src/api";
import { PatientMapper } from "./patient.mapper";

export class PatientLogic extends EnterpriseCollectionLogic<
    PatientModel,
    PatientCollectionProvider,
    GetPatientRequest,
    Patient
> {
    static instance: PatientLogic;
    protected mapper: PatientMapper;

    constructor(api: EnterpriseApi) {
        super(api, PatientCollectionProvider, PatientMapper);
    }
}

PatientLogic.register();