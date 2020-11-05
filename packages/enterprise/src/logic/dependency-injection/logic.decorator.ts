import { EnterpriseLogic } from "..";
import { EnterpriseLogicBoot } from "./enterprise-logic.boot";

export function logic(logicClass: typeof EnterpriseLogic) {
    EnterpriseLogicBoot.register(logicClass);
}
