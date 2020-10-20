import { AuthDataProvider } from "./auth.data-provider";
import { SignInRequest, SignInResponseModel } from "./auth.api";
import { EnterpriseLogic, IEnterpriseApi } from "@sabasayer/enterprise";
import {  IApiResponse } from "@sabasayer/enterprise";

export class AuthLogic extends EnterpriseLogic {
    static instance: AuthLogic;
    private provider: AuthDataProvider;

    constructor(api: IEnterpriseApi) {
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
