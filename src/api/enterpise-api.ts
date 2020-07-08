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

    private createBaseUrl(options: EnterpriseApiOptions): string {
        if (options.baseUrl)
            return this.ensureLastCharacterToBeSlash(options.baseUrl);

        const configHostName = options.hostName ?? this.getHostNameFromEndPoints(options.endpoints);

        if (!configHostName)
            throw new Error("hostName , endPoints or baseUrl is required");

        const protocol = options.protocol ? `${options.protocol}://` : "//";
        const hostName = configHostName ? `${configHostName}/` : "";
        const languagePrefix = options.languagePrefix
            ? `${options.languagePrefix}/`
            : "";
        const prefix = options.prefix ? `${options.prefix}/` : ""

        const baseUrl = `${protocol}${hostName}${languagePrefix}${prefix}`;

        return this.ensureLastCharacterToBeSlash(baseUrl);
    }

    private getHostNameFromEndPoints(endPoints?: Record<string, string>) {
        return endPoints?.[window.location.host];
    }

    private ensureLastCharacterToBeSlash(baseUrl: string): string {
        if (baseUrl[baseUrl.length - 1] != "/") return baseUrl + "/";
        return baseUrl;
    }

    private initAxios(options: EnterpriseApiOptions) {
        this.axios = axios.create({
            baseURL: this.createBaseUrl(options),
            headers: options.headers,
        });
    }

    get dataField(){
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
    get(url: string, data?: Record<string, any>, config?: AxiosRequestConfig): AxiosPromise | never {
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
        return this.axios.delete(url, data);
    }



    getAxios(): AxiosInstance | null {
        return this.axios;
    }

    setOptions(options: EnterpriseApiOptions): void {
        this.options = options;
        this.initAxios(options);
    }

    getOptions(): DeepReadonly<EnterpriseApiOptions> {
        return cloneDeep(this.options);
    }

    setHeader(key: string, value: string) {
        if (!this.axios) throw new Error("axios is not initialized");

        this.axios.defaults.headers[key] = value;
    }
}
