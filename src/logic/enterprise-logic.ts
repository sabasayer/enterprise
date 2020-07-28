import { EnterpriseApi } from "@/api";
import { EnterpriseLogicBoot } from "./enterprise-logic.boot";

export class EnterpriseLogic {
    static instance: EnterpriseLogic;

    constructor(api?: EnterpriseApi) {}

    /**
     * Registers to LogicBoot class for providing api
     */
    static register() {
        EnterpriseLogicBoot.register(this);
    }
}
