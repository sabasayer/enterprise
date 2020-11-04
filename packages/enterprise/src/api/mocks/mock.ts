import { AxiosRequestConfig } from "axios";
import { EnterpriseApiOptions, IEnterpriseApi } from "..";
import cloneDeep from "lodash/cloneDeep";

export class MockEnterpriseApi implements IEnterpriseApi {

    getAuthToken() {
        return "";
    }

    setAuthToken(token: string) {}

    async get(url: string, data?: Record<string, any>, config?: AxiosRequestConfig) {
        return new Promise((resolve) => resolve({ data: cloneDeep(data), status: 200 })) as any;
    }

    async post(url: string, data?: any, config?: AxiosRequestConfig) {
        return new Promise((resolve) => resolve({ data: cloneDeep(data), status: 200 })) as any;
    }

    async put(url: string, data?: any, config?: AxiosRequestConfig) {
        return new Promise((resolve) => resolve({ data: cloneDeep(data), status: 200 })) as any;
    }

    async delete(url: string, data?: any, config?: AxiosRequestConfig) {
        return new Promise((resolve) => resolve({ data: cloneDeep(data), status: 200 })) as any;
    }

    async upload(
        url: string,
        files: File[],
        data?: any,
        dataKey?: string,
        onUploadProgress?: (progressEvent: ProgressEvent) => void
    ) {
        return new Promise((resolve) => resolve({ data: cloneDeep(data), status: 200 })) as any;
    }

    getAxios() {
        return undefined;
    }

    setOptions(options: EnterpriseApiOptions) {}

    getOptions() {
        return {};
    }

    setHeader(key: string, value: string) {}
}
