import { Patient } from "./patient";
import { IApiRequestOptions } from "../../src/api/provider/api-request-options.interface";

export interface GetPatientRequest {
    search?: string;
    key?: number[];
    model?: Partial<Patient>;
}

export const getPatientRequestOptions: IApiRequestOptions = {
    url: "patient",
    validationRules: [],
};
