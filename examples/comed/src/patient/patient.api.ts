import { IApiRequestOptions } from "../../../../src/api";

export interface GetPatientRequest {
    keys?: number[];
}

export interface PatientModel {
    id: number;
    visits?: any[];
    patientType?: number;
    bloodType?: number;
    disabledState?: number;
    name?: string;
    email?: string;
    mobilePhone?: string;
    surname?: string;
    gender?: string;
    phone?: string;
    birthDate?: string;
    identityNumber?: string;
    homeCountryId?: number;
    homeCityId?: number;
    homeTownId?: number;
    homeAddress?: string;
    passportNumber?: string;
    nationalityId?: number;
    maritalStatus?: string;
    fatherName?: string;
    motherName?: string;
    patientSourceType?: string;

    referenceKey?: string;
    ssiFoundationId?: number;
    phiFoundationId?: number;
    contractedFoundationId?: number;
    discountGroupId?: number;
    workFoundationId?: number;
}

export interface Patient {
    id: number;
    inpatientId?: number;
    visitId?: number;
    adi: string;
    resim: string;
    cinsiyet: string;
    yas: string | number;
    age?: number;
    dogumTarihi: string;
    alerjiler?: string;
    hastaliklar?: string;
    takipHastasi?: boolean;
    doktoru?: string;
    sigorta?: string;
    visitServis?: string;
    kat?: string;
    floorId?: number;
    oda?: string;
    yatak?: string;
    bloodType?: any;
    disabledState?: any;
    migrationProtocolNo?: string;
    tcKimlikNo?: string;
    passportNumber?: string;
    email?: string;
    mobilePhone?: string;
    phone?: string;
    homeCountryId?: number;
    homeCityId?: number;
    homeTownId?: number;
    homeAddress?: string;
    nationalityId?: number;
    maritalStatus?: number;
    fatherName?: string;
    motherName?: string;
}

export const getPatientRequestOptions: IApiRequestOptions = {
    url: "shared/patient/getPatients",
};
