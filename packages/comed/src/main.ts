import { enterpirseBoot } from "@sabasayer/enterprise";
import { apiConfig } from "../api.config";
import { AuthComponent } from "./auth/auth.component";
import { ErrorMessages } from "@sabasayer/enterprise";
import { PatientComponent } from "./patient/patient.component";
import { LaboratoryOrderComponent } from "./laboratory-order/laboratory-order.component";

const enterpriseApi = enterpirseBoot({
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

new AuthComponent();
new PatientComponent();
new LaboratoryOrderComponent();
