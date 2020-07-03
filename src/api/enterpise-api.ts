import { EnterpriseApiOptions } from "./enterprise-api.options";
import cloneDeep from "lodash.clonedeep";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosPromise } from "axios";
import { EnterpriseApiHelper } from "./enterprise-api.helper";
import { IEnterpriseApi } from "./enterprise.api.interfaces";

export class EnterpriseApi implements IEnterpriseApi {
  private options: EnterpriseApiOptions;
  private axios: AxiosInstance | null = null;

  constructor(options: EnterpriseApiOptions) {
    this.options = options;
    this.initAxios(options);
  }

  private createBaseUrl(options: EnterpriseApiOptions): string {
    if (options.baseUrl)
      return this.ensureLastCharacterToBeSlash(options.baseUrl);

    if (!options.hostName) throw new Error("hostName or baseUrl is required");

    const protocol = options.protocol ? `${options.protocol}://` : "//";
    const hostName = options.hostName ? `${options.hostName}/` : "";
    const prefix = options.languagePrefix ? `${options.languagePrefix}/` : "";

    const baseUrl = `${protocol}${hostName}${prefix}`;

    return this.ensureLastCharacterToBeSlash(baseUrl);
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

  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise | never {
    if (!this.axios) throw new Error("axios is not initialized");

    return this.axios?.post(url, data, config);
  }

  /**
   * converts data to querystring and appends to url
   * @param data should only contain one level nested values
   */
  get(url: string, data?: Record<string, any>, config?: AxiosRequestConfig) {
    if (!this.axios) throw new Error("axios is not initialized");

    if (data) {
      url = EnterpriseApiHelper.createUrl(url, data);
    }

    return this.axios?.get(url, config);
  }

  getAxios(): AxiosInstance | null {
    return this.axios;
  }

  setOptions(options: EnterpriseApiOptions): void {
    this.options = options;
    this.initAxios(options)
  }

  getOptions(): DeepReadonly<EnterpriseApiOptions> {
    return cloneDeep(this.options);
  }

  setHeader(key:string,value:string){
    if (!this.axios) throw new Error("axios is not initialized");

    this.axios.defaults.headers[key] = value;
  }
}
