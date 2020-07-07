import { Patient } from "./patient";
import { EnterpriseCollectionLogic, EnterpriseApi } from '../..'
import { PatientCollectionProvider } from "./patient-collection-provider";
import { GetPatientRequest, SavePatientsRequest, DeletePatientsRequest } from "./patient.api";
import { IEnterpriseCollectionLogic } from '../..'
import { ErrorMessages } from "../../src/shared/definitions/error-messages.interface";
import { IApiResponse } from "../../src/api/provider/api-response.interface";
import { IValidationResponse } from "../../src/logic/validation-response.interface";

export class PatientCollectionLogic implements IEnterpriseCollectionLogic<Patient>{
    static instance: PatientCollectionLogic;
    provider: PatientCollectionProvider;

    constructor(api: EnterpriseApi) {
        this.provider = new PatientCollectionProvider(api)
    }

    static initialize(api: EnterpriseApi) {
        this.instance = new PatientCollectionLogic(api)
    }

    async get(options: GetPatientRequest) {
        return this.provider.get(options, { ids: options.key, forceGetFromApi: !options.key?.length })
    }

    async getOne(options: GetPatientRequest) {
        const result = await this.provider.get(options, { ids: options.key, forceGetFromApi: !options.key?.length })

        return {
            errorMessages: result.errorMessages,
            data: result.data?.[0]
        }
    }

    async save(options: SavePatientsRequest) {
        const validationResult = this.validateMany(options.patients);
        if (!validationResult.valid)
            return {
                errorMessages: validationResult.errorMessages
            }

        return this.provider.save<Patient>(options);
    }

    async delete(options: DeletePatientsRequest) {
        return this.provider.delete<boolean>(options)
    }


    validate(model: Patient) {
        let result: IValidationResponse = {
            valid: true,
            errorMessages: {}
        }

        if (model.name.length < 2) {
            result.valid = false;
            result.errorMessages['name'] = 'en az 2 karekter olmalı';
        }

        return result
    }


    validateMany(models: Patient[]) {
        let result: IValidationResponse = {
            valid: true,
            errorMessages: {}
        }

        models.forEach(model => {
            const validationResult = this.validate(model);
            if (validationResult.valid) return;

            result.errorMessages[model.name] = validationResult.errorMessages
            result.valid = false;
        })

        return result
    }


}