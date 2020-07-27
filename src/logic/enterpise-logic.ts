import { EnterpriseApi } from "@/api";
import { EnterpriseLogicBoot } from "./enterprise-logic.boot";

export class EnterpirseLogic {
    static instance: EnterpirseLogic;

    constructor(api?: EnterpriseApi) {}

    static register() {
        EnterpriseLogicBoot.register(this);
    }
}
