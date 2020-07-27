import { AxiosRequestConfig } from "axios";
import { EnumRequestMethod } from "../enums/request-method.enum";

export interface IEnterpriseRequestOptions {
    url: string;
    data?: any;
    config?: AxiosRequestConfig;
    method?: EnumRequestMethod;
    files?: File[];
    dataKeyOnFileUpload?:string
    mustCheckWaitingRequest: boolean;
}
