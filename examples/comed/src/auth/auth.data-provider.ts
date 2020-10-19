import { EnumCacheType } from "@sabasayer/utils";
import { EnterpriseDataProvider, IApiResponse, IEnterpriseApi } from "../../../../src/api";
import { SignInRequest, SignInResponseModel, signInRequestOptions } from "./auth.api";
import { EnterpriseDataHouse } from "../../../../src/data-house";

export class AuthDataProvider extends EnterpriseDataProvider {
    private readonly signInResponseKey: string = "signInResponse";

    constructor(api: IEnterpriseApi) {
        super(api);
        this.initAuthTokenFromStorage();
    }

    async signIn(
        request: SignInRequest
    ): Promise<IApiResponse<SignInResponseModel>> {
        const result = await this.apiRequest<
            SignInRequest,
            SignInResponseModel
        >(signInRequestOptions, request);
        if (result.errorMessages) return result;

        this.setAuthToken(result.data);
        return result;
    }

    initAuthTokenFromStorage() {
        const storageData = EnterpriseDataHouse.instance.get<
            SignInResponseModel
        >(EnumCacheType.SessionStorage, this.signInResponseKey);

        const data = storageData[0];

        if (!data) return;

        this.setAuthToken(data);
    }

    setAuthToken(data: SignInResponseModel) {
        EnterpriseDataHouse.instance.set(
            EnumCacheType.SessionStorage,
            this.signInResponseKey,
            [data]
        );
        this.api.setAuthToken(data.token);
    }

    get authenticationData(): SignInResponseModel | undefined {
        return EnterpriseDataHouse.instance.get<SignInResponseModel>(
            EnumCacheType.SessionStorage,
            this.signInResponseKey
        )?.[0];
    }

    get token(): string | undefined {
        return this.authenticationData?.token;
    }

    get isAuthenticated(): boolean {
        return !!this.token;
    }
}
