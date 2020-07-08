import { EnterpriseDataProvider } from "../../../src/api/provider/enterprise-data-provider";
import { signInRequestOptions, SignInRequest, SignInResponseModel } from "./auth.api";
import { IApiResponse } from "../../../src/api/provider/api-response.interface";
import { EnterpriseDataHouse } from "../../..";
import { EnumCacheType } from "@sabasayer/utils";

export class AuthDataProvider extends EnterpriseDataProvider {
    private readonly signInResponseKey: string = 'signInResponse';

    async signIn(request: SignInRequest): Promise<IApiResponse<SignInResponseModel>> {
        const result = await this.apiRequest<SignInRequest, SignInResponseModel>(signInRequestOptions, request);
        if (result.errorMessages) return result;

        EnterpriseDataHouse.instance.set(EnumCacheType.SessionStorage, this.signInResponseKey, [result.data]);
        this.api.setAuthToken(result.data.token)
        return result;
    }

    get authenticationData(): SignInResponseModel | undefined {
        return EnterpriseDataHouse.instance.get<SignInResponseModel>(EnumCacheType.SessionStorage, this.signInResponseKey)?.[0]
    }

    get token(): string | undefined {
        return this.authenticationData?.token
    }

    get isAuthenticated(): boolean {
        return !!this.token
    }

}