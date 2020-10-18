import { Patient } from "./patient";
import { EnterpriseCollectionLogic, EnterpriseApi } from "../..";
import { PatientCollectionProvider } from "./patient-collection-provider";
import {
    GetPatientRequest,
    SavePatientsRequest,
    DeletePatientsRequest,
} from "./patient.api";
import { ErrorMessages } from "../../src/shared/definitions/error-messages.interface";
import { IApiResponse } from "../../src/api/provider/api-response.interface";
import { GetCollectionOptions } from "../../src/data-house";
import { IValidationResult } from "../../src/logic";

export class PatientCollectionLogic
    extends EnterpriseCollectionLogic<Patient,PatientCollectionProvider> {
    static instance: PatientCollectionLogic;
    provider: PatientCollectionProvider;

    constructor(api: EnterpriseApi) {
        super(api,PatientCollectionProvider)
    }

    static initialize(api: EnterpriseApi) {
        this.instance = new PatientCollectionLogic(api);
    }

    validate(model: Patient) {
        let result: IValidationResult = {
            valid: true,
            errorMessages: {},
        };

        if (model.name.length < 2) {
            result.valid = false;
            result.errorMessages["name"] = "en az 2 karekter olmalı";
        }

        return result;
    }

    async validateMany(models: Patient[]) {
        let result: IValidationResult = {
            valid: true,
            errorMessages: {},
        };

        models.forEach((model) => {
            const validationResult = this.validate(model);
            if (validationResult.valid) return;

            result.errorMessages[model.name] = validationResult.errorMessages;
            result.valid = false;
        });

        return result;
    }
}
