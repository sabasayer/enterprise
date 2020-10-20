import { LaboratoryOrderLogic } from "./laboratory-order.logic";

export class LaboratoryOrderComponent {
    constructor() {
        this.get();
    }

    async get() {
        const result = await LaboratoryOrderLogic.instance.get({ search: "a" });

        if (result.canceled) return;

        if (result.errorMessages) {
            document.body.innerHTML = JSON.stringify(result.errorMessages);
            return;
        }

    }
}
