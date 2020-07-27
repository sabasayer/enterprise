import { EnterpirseLogic } from "./enterpise-logic";
import { EnterpriseApi } from "@/api";

export abstract class EnterpriseLogicBoot {
    private static collection: typeof EnterpirseLogic[] = [];

    static register(logic: typeof EnterpirseLogic) {
        this.collection.push(logic);
    }

    static initialize(api: EnterpriseApi) {
        this.collection.forEach((logic) => {
            logic.instance = new logic(api);
        });

        this.collection = [];
    }
}
