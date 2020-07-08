import { EnterpriseApi } from "../..";
import { apiConfig } from "./api.config";
import { AuthLogic } from "./auth/auth.logic";
import { AuthComponent } from "./auth/auth.component";


const enterpriseApi = new EnterpriseApi({
    endpoints: apiConfig.endpoints,
    prefix: apiConfig.prefix,
    languagePrefix: 'tr-tr',
    dataField: 'data',
    headers: {
        "x-application-key": apiConfig.appKey,
        "content-type": "application/json"
    },
    authTokenHeaderKey: 'x-authentication-token'
})

AuthLogic.initialize(enterpriseApi);
new AuthComponent();