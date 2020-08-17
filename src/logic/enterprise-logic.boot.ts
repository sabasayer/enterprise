import { EnterpriseLogic } from "./enterprise-logic";
import { EnterpriseApi } from "../api";

export abstract class EnterpriseLogicBoot {
    private static api: EnterpriseApi;
    private static collection: typeof EnterpriseLogic[] = [];

    static register(logic: typeof EnterpriseLogic) {
        this.collection.push(logic);

        if (this.api) this.initialize(this.api);
    }

    static initialize(api: EnterpriseApi) {
        this.api = api;
        this.collection.forEach((logic) => {
            this.initalizeLogic(logic, api);
        });

        this.collection = [];
    }

    private static initalizeLogic(
        logic: typeof EnterpriseLogic,
        api: EnterpriseApi
    ) {
        logic.instance = new logic(api);
    }
}
