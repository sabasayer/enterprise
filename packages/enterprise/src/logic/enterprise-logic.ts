import { IEnterpriseApi } from "../api";
import { EnterpriseLogicBoot } from "./enterprise-logic.boot";
import { IEnterpriseLogic } from "./types/enterprise-logic.interface";

export class EnterpriseLogic implements IEnterpriseLogic {
    static instance: EnterpriseLogic;

    constructor(api?: IEnterpriseApi) {}

    ready?(): void | Promise<void>;
 
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
