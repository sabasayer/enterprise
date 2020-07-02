export abstract class EnterpriseApiHelper {
    static createUrl(url: string, data: Record<string, any>): string {
        const queryString = new URLSearchParams(data).toString();
        return `${url}?${queryString}`;
    }
}