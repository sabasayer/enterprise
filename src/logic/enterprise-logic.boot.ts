import { EnterpriseLogic } from "./enterprise-logic";
import { EnterpriseApi } from "@/api";

export abstract class EnterpriseLogicBoot {
    private static collection: typeof EnterpriseLogic[] = [];

    static register(logic: typeof EnterpriseLogic) {
        this.collection.push(logic);
    }

    static initialize(api: EnterpriseApi) {
        this.collection.forEach((logic) => {
            logic.instance = new logic(api);
        });

        this.collection = [];
    }
}
