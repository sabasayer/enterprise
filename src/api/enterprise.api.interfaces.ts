import { AxiosRequestConfig, AxiosPromise, AxiosInstance } from "axios";
import { EnterpriseApiOptions } from ".";
export interface IEnterpriseApi {
    get(
        url: string,
        data?: Record<string, any>,
        config?: AxiosRequestConfig
    ): AxiosPromise | never;

    post(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): AxiosPromise | never;

    put(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): AxiosPromise | never;

    delete(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): AxiosPromise | never;
        
    upload(
        url: string,
        files: File[],
        data?: any,
        dataKey?: string,
        onUploadProgress?: (progressEvent: ProgressEvent) => void
    ): void;

    getAxios(): AxiosInstance | null;

    setOptions(options: EnterpriseApiOptions): void;

    getOptions(): EnterpriseApiOptions;

    setHeader(key: string, value: string): void;
}
