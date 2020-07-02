import { AxiosRequestConfig, AxiosPromise } from "axios";

export type EnterpriseApiPost = (url: string, data?: any, config?: AxiosRequestConfig) => AxiosPromise | never

export interface IEnterpriseApi{
    post:EnterpriseApiPost
}