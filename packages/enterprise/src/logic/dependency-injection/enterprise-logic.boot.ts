import { EnterpriseLogic } from "../enterprise-logic";
import { IEnterpriseApi } from "../../api";

export abstract class EnterpriseLogicBoot {
    private static api: IEnterpriseApi;
    private static collection: typeof EnterpriseLogic[] = [];

    static register(logic: typeof EnterpriseLogic) {
        this.collection.push(logic);

        if (this.api) this.initialize(this.api);
    }

    static initialize(api: IEnterpriseApi) {
        this.api = api;
        this.collection.forEach((logic) => {
            this.initalizeLogic(logic, api);
        });

        this.collection.forEach(this.runReadyMethods);

        this.collection = [];
    }

    private static runReadyMethods(logic: typeof EnterpriseLogic) {
        logic.instance?.ready?.();
    }

    private static initalizeLogic(logic: typeof EnterpriseLogic, api: IEnterpriseApi) {
        logic.instance = new logic(api);
    }
}
