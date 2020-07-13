import { EnterpriseApiOptions } from "./enterprise-api.options";

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
}