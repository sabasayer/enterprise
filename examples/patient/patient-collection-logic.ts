import { Patient } from "./patient";
import { PatientCollectionProvider } from "./patient-collection-provider";
import { EnterpriseCollectionLogic, IValidationResult } from "../../src/logic";
import { IEnterpriseApi } from "../../src/api";

export class PatientCollectionLogic extends EnterpriseCollectionLogic<
    Patient,
    PatientCollectionProvider
> {
    static instance: PatientCollectionLogic;

    constructor(api: IEnterpriseApi) {
        super(api, PatientCollectionProvider);
    }

    static initialize(api: IEnterpriseApi) {
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
