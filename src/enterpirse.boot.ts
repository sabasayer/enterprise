import { EnterpriseApi, EnterpriseApiOptions } from "./api";
import { EnterpriseLogicBoot } from "./logic";

export const enterpirseBoot = (
    apiOptions: EnterpriseApiOptions
): EnterpriseApi => {
    const api = new EnterpriseApi(apiOptions);
    EnterpriseLogicBoot.initialize(api);

    return api;
};
