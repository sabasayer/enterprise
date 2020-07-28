import { EnterpriseMapper } from "../../../../src/mapper";
import { Patient, PatientModel } from "./patient.api";

export class PatientMapper extends EnterpriseMapper<PatientModel, Patient> {
    constructor() {
        super({
            toViewModel: {
                onlyMapDefinedFields:true,
                mappers: {
                    adi: (model) =>
                        `${model.name ?? ""} ${model.surname ?? ""}`,
                    cinsiyet: (model) => model.gender ?? "E",
                    dogumTarihi: "birthDate",
                    migrationProtocolNo: "referenceKey",
                    tcKimlikNo: "identityNumber",
                    yas: (model) => (model.birthDate ? 10 : ""),
                },
            },
        });
    }
}
