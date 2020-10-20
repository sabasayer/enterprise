import { IApiRequestOptions } from "@sabasayer/enterprise";

export interface SignInRequest{
    username:string
    password:string
    tenantId:number
}

export interface SignInResponseModel {
    identity: any;
    credential: any;
    token: string;
    tenantId: number;
    version: string;
    serverDate:string;
}


export const signInRequestOptions:IApiRequestOptions={
    url:'core/auth/signIn'
}