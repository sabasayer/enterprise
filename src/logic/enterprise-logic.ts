import {IEnterpriseApi } from "../api";
import { EnterpriseLogicBoot } from "./enterprise-logic.boot";

export class EnterpriseLogic {
    static instance: EnterpriseLogic;

    constructor(api?: IEnterpriseApi) {}

    /**
     * Registers to LogicBoot static class. 
     * Registered logics will use main EnterpriseApi.
     * Don't register if you want to use different EnterpriseApi
     * If you dont call register, you need to manualy create instance property
     */
    static register() {
        EnterpriseLogicBoot.register(this);
    }
}
