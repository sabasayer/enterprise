import { EnterpriseApi, EnterpriseApiOptions } from "./api";
import { EnterpriseLogicBoot } from "./logic/dependency-injection/enterprise-logic.boot";

export const enterpirseBoot = (
    apiOptions: EnterpriseApiOptions
): EnterpriseApi => {
    const api = new EnterpriseApi(apiOptions);
    EnterpriseLogicBoot.initialize(api);

    return api;
};
