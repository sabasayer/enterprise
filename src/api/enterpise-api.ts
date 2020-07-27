import { EnterpriseApiOptions } from "./enterprise-api.options";
import cloneDeep from "lodash.clonedeep";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosPromise } from "axios";
import { EnterpriseApiHelper } from "./enterprise-api.helper";
import { IEnterpriseApi } from "./enterprise.api.interfaces";

export class EnterpriseApi implements IEnterpriseApi {
    private options: EnterpriseApiOptions;
    private axios: AxiosInstance | null = null;
    private authToken: string | null = null;

    constructor(options: EnterpriseApiOptions) {
        this.options = options;
        this.initAxios(options);
    }

    private initAxios(options: EnterpriseApiOptions) {
        this.axios = axios.create({
            baseURL: EnterpriseApiHelper.createBaseUrl(options),
            headers: options.headers,
        });
    }

    get dataField() {
        return this.options.dataField;
    }

    getAuthToken() {
        return this.authToken;
    }

    setAuthToken(token: string) {
        this.authToken = token;
        if (this.options.authTokenHeaderKey)
            this.setHeader(this.options.authTokenHeaderKey, token);
    }

    /**
     * converts data to querystring and appends to url
     * @param data should only contain one level nested values
     */
    get(
        url: string,
        data?: Record<string, any>,
        config?: AxiosRequestConfig
    ): AxiosPromise | never {
        if (!this.axios) throw new Error("axios is not initialized");

        if (data) {
            url = EnterpriseApiHelper.createUrl(url, data);
        }

        return this.axios.get(url, config);
    }

    post(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): AxiosPromise | never {
        if (!this.axios) throw new Error("axios is not initialized");

        return this.axios.post(url, data, config);
    }

    put(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): AxiosPromise | never {
        if (!this.axios) throw new Error("axios is not initialized");

        return this.axios.put(url, data, config);
    }

    delete(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): AxiosPromise | never {
        if (!this.axios) throw new Error("axios is not initialized");

        if (data) {
            url = EnterpriseApiHelper.createUrl(url, data);
        }
        return this.axios.delete(url, config);
    }

    upload(
        url: string,
        files: File[],
        data?: any,
        dataKey?: string,
        onUploadProgress?: (progressEvent: ProgressEvent) => void
    ) {
        if (!this.axios) throw new Error("axios is not initialized");

        let formData = new FormData();

        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i], files[i].name);
        }

        formData.append(dataKey ?? "data", JSON.stringify(data));

        const config = onUploadProgress ? { onUploadProgress } : undefined;

        return this.axios.post(url, formData, config);
    }

    getAxios(): AxiosInstance | null {
        return this.axios;
    }

    setOptions(options: EnterpriseApiOptions): void {
        this.options = options;
        this.initAxios(options);
    }

    getOptions(): EnterpriseApiOptions {
        return cloneDeep(this.options);
    }

    setHeader(key: string, value: string) {
        if (!this.axios) throw new Error("axios is not initialized");

        this.axios.defaults.headers[key] = value;
    }
}
