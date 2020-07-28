import { EnterpriseCollectionLogic } from "../../../../src/logic";
import { PatientModel, GetPatientRequest, Patient } from "./patient.api";
import { PatientCollectionProvider } from "./patient.collection-provider";
import { EnterpriseApi, IApiResponse } from "../../../../src/api";
import { PatientMapper } from "./patient.mapper";

export class PatientLogic extends EnterpriseCollectionLogic<
    PatientModel,
    PatientCollectionProvider,
    Patient
> {
    static instance: PatientLogic;
    private mapper: PatientMapper;

    constructor(api: EnterpriseApi) {
        super(new PatientCollectionProvider(api));
        this.mapper = new PatientMapper();
    }

    // async get(options: GetPatientRequest): Promise<IApiResponse<Patient[]>> {

    //     const result = await this.provider.get(options);
    //     if (result.canceled || result.errorMessages)
    //         return {
    //             canceled: result.canceled,
    //             errorMessages: result.errorMessages,
    //         };

    //     const values = result.data?.map((e) => this.mapper.mapToVm(e));
        
    //     return <IApiResponse<Patient[]>>{
    //         data: values,
    //     };
    // }
    

}

PatientLogic.register();
PatientLogic.instance.get
