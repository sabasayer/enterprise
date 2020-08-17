import { Patient, PatientModel } from "./patient.api";
import { EnterpriseMapper } from "../../../../dist";

export class PatientMapper extends EnterpriseMapper<PatientModel, Patient> {
    constructor() {
        super({
            toViewModel: {
                onlyMapDefinedFields: true,
                mappers: {
                    id: "id",
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
