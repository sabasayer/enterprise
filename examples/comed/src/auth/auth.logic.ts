import { AuthDataProvider } from "./auth.data-provider";
import { EnterpriseApi } from "../../../..";
import { SignInRequest, SignInResponseModel } from "./auth.api";
import { IApiResponse } from "../../../..";
import { EnterpriseLogic } from "../../../..";

export class AuthLogic extends EnterpriseLogic {
    static instance: AuthLogic;
    private provider: AuthDataProvider;

    constructor(api: EnterpriseApi) {
        super();
        this.provider = new AuthDataProvider(api);
    }

    async signIn(
        request: SignInRequest
    ): Promise<IApiResponse<SignInResponseModel>> {
        return this.provider.signIn(request);
    }

    get isAuthenticated() {
        return this.provider.isAuthenticated;
    }
}

AuthLogic.register();
