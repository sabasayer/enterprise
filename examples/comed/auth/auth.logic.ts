import { AuthDataProvider } from "./auth.data-provider";
import { EnterpriseApi } from "../../..";
import { SignInRequest, SignInResponseModel } from "./auth.api";
import { IApiResponse } from "../../../src/api/provider/api-response.interface";

export class AuthLogic {
    static instance: AuthLogic;
    private provider: AuthDataProvider;

    constructor(api: EnterpriseApi) {
        this.provider = new AuthDataProvider(api);
    }

    static initialize(api: EnterpriseApi) {
        this.instance = new AuthLogic(api);
    }

    async signIn(request: SignInRequest): Promise<IApiResponse<SignInResponseModel>> {
        return this.provider.signIn(request);
    }

    get isAuthenticated() {
        return this.provider.isAuthenticated
    }
}