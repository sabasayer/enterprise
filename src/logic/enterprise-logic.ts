import { EnterpriseApi } from "@/api";
import { EnterpriseLogicBoot } from "./enterprise-logic.boot";

export class EnterpriseLogic {
    static instance: EnterpriseLogic;

    constructor(api?: EnterpriseApi) {}

    /**
     * Registers to LogicBoot static class. 
     * Registered logics will use main EnterpriseApi.
     * Don't register if you want to use different EnterpriseApi
     */
    static register() {
        EnterpriseLogicBoot.register(this);
    }
}
