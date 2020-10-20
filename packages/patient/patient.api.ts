import { Patient } from "./patient";
import { IApiRequestOptions } from "@sabasayer/enterprise";
import { EnumRequestMethod } from "@sabasayer/enterprise";

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
    method:EnumRequestMethod.GET
};

export const savePatientsRequestOptions: IApiRequestOptions = {
    url: "patient",
    validationRules: [],
    method:EnumRequestMethod.POST
}

export const deletePatientsRequestOptions: IApiRequestOptions = {
    url: "patient",
    validationRules: [],
    method:EnumRequestMethod.DELETE
}