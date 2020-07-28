import { PatientLogic } from "./patient.logic";

export class PatientComponent {
    constructor() {
        this.get();
    }

    async get() {
        const result = await PatientLogic.instance.get({});

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
    }
}
