import { EnterpriseApi } from "../..";
import { apiConfig } from "./api.config";
import { AuthLogic } from "./auth/auth.logic";
import { AuthComponent } from "./auth/auth.component";
import { ErrorMessages } from "../../src/shared";
import { TenantLogic } from "./tenant/tenant.logic";

const enterpriseApi = new EnterpriseApi({
    endpoints: apiConfig.endpoints,
    prefix: apiConfig.prefix,
    languagePrefix: "tr-tr",
    dataField: "data",
    headers: {
        "x-application-key": apiConfig.appKey,
        "content-type": "application/json",
    },
    authTokenHeaderKey: "x-authentication-token",
    createErrorMessagesFunc: (response) => {
        const errorMessages: ErrorMessages = {};
        response.data.messages?.forEach(
            (message: { key: string; value: string }) => {
                errorMessages[message.key] = message.value;
            }
        );

        return errorMessages;
    },
});

AuthLogic.initialize(enterpriseApi);
TenantLogic.initialize(enterpriseApi);
new AuthComponent();

TenantLogic.instance.get({});