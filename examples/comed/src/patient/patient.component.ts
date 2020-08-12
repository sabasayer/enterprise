import { PatientLogic } from "./patient.logic";
import { IApiResponse } from "../../../../src/api";
import { Patient } from "./patient.api";

export class PatientComponent {
    constructor() {
        this.get();
    }

    async get() {
        const result = await PatientLogic.instance.get(
            {},
            { forceGetFromApi: true }
        );

        if (result.canceled) return;

        if (result.errorMessages) {
            document.body.innerHTML = JSON.stringify(result.errorMessages);
            return;
        }

        result.data?.forEach((item) => {
            const element = document.createElement("div");
            element.innerHTML = JSON.stringify(item);
            document.body.append(element);
        });

        this.getOne();
    }

    async getOne() {
        const result = await PatientLogic.instance.getOne({ keys: [78931] });
        console.log("getone result", result);
    }
}
