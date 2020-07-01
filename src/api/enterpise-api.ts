import { EnterpriseApiOptions } from "./enterprise-api.options";
import cloneDeep from "lodash.clonedeep";
import axios, { AxiosInstance } from "axios";

export class EnterpriseApi {
  private options: EnterpriseApiOptions;
  private axios: AxiosInstance | null = null;

  constructor(options: EnterpriseApiOptions) {
    this.options = options;
    this.initAxios(options);
  }

  private createBaseUrl(options: EnterpriseApiOptions): string {
    if (options.baseUrl)
      return this.ensureLastCharacterToBeSlash(options.baseUrl);

    const protocol = options.protocol ? `${options.protocol}:/` : "";
    const hostName = options.hostName ?? "";
    const prefix = options.languagePrefix ?? "";

    const baseUrl = [protocol, hostName, prefix].join("/");

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

  getAxios(): AxiosInstance | null {
    return this.axios;
  }

  setOptions(options: EnterpriseApiOptions): void {
    this.options = options;
  }

  getOptions(): DeepReadonly<EnterpriseApiOptions> {
    return cloneDeep(this.options);
  }
}
