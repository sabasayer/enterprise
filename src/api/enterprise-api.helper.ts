import { EnterpriseApiOptions } from "./enterprise-api.options";
import { EnumRequestMethod } from "./enums/request-method.enum";
import Axios from "axios";

export abstract class EnterpriseApiHelper {
    static createUrl(url: string, data: Record<string, any>): string {
        const queryString = new URLSearchParams(data).toString();
        return `${url}?${queryString}`;
    }

    static getHostNameFromEndPoints(endPoints?: Record<string, string>) {
        return endPoints?.[window.location.host];
    }

    static ensureLastCharacterToBeSlash(baseUrl: string): string {
        if (baseUrl[baseUrl.length - 1] != "/") return baseUrl + "/";
        return baseUrl;
    }

    static createBaseUrl(options: EnterpriseApiOptions): string {
        if (options.baseUrl)
            return EnterpriseApiHelper.ensureLastCharacterToBeSlash(options.baseUrl);

        const configHostName = options.hostName ?? EnterpriseApiHelper.getHostNameFromEndPoints(options.endpoints);

        if (!configHostName)
            throw new Error("hostName , endPoints or baseUrl is required");

        const protocol = options.protocol ? `${options.protocol}://` : "//";
        const hostName = configHostName ? `${configHostName}/` : "";
        const languagePrefix = options.languagePrefix
            ? `${options.languagePrefix}/`
            : "";
        const prefix = options.prefix ? `${options.prefix}/` : ""

        const baseUrl = `${protocol}${hostName}${languagePrefix}${prefix}`;

        return EnterpriseApiHelper.ensureLastCharacterToBeSlash(baseUrl);
    }

    static createDataHash(data?: any) {
        return data != undefined ? JSON.stringify(data) : '';
    }

    static createUniqueKey(url: string, data?: any, method: EnumRequestMethod = EnumRequestMethod.POST) {
        const dataHash = EnterpriseApiHelper.createDataHash(data);
        const requestHash = EnterpriseApiHelper.createRequestHash(url, method);
        return `${requestHash}_${dataHash}`;
    }

    static createRequestHash(url: string, method: EnumRequestMethod = EnumRequestMethod.POST) {
        return `${method}_${url}`;
    }

    static createCancelToken() {
        return Axios.CancelToken.source();
    }
}