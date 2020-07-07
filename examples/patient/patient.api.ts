import { Patient } from "./patient";
import { IApiRequestOptions } from "../../src/api/provider/api-request-options.interface";

export interface GetPatientRequest {
    search?: string;
    key?: string[];
    model?: Partial<Patient>;
}

export interface SavePatientsRequest {
    patients: Patient[]
}

export interface DeletePatientsRequest {
    patients: string[]
}

export const getPatientRequestOptions: IApiRequestOptions = {
    url: "patient",
    validationRules: [],
};

export const savePatientsRequestOptions: IApiRequestOptions = {
    url: "patient",
    validationRules: []
}

export const deletePatientsRequestOptions: IApiRequestOptions = {
    url: "patient",
    validationRules: []
}