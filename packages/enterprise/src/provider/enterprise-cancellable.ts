import { CancelTokenSource } from "axios";
import { IApiRequestOptions } from ".";
import { EnterpriseApiHelper } from "../api";

export class EnterpriseCancellable{
    protected cancelTokens: Map<string, CancelTokenSource[]>;

    constructor(){
        this.cancelTokens = new Map();
    }
    
    protected createCancelTokenKey(
        options: IApiRequestOptions,
        uniqueKey: string
    ) {
        const requestHash = EnterpriseApiHelper.createRequestHash(
            options.url,
            options.method
        );
        return `${uniqueKey}_${requestHash}`;
    }

    
    protected cancelPreviousPromises(key: string) {
        const tokenList = this.cancelTokens.get(key);
        if (!tokenList) return;

        tokenList.forEach((token) => {
            token.cancel();
        });
    }
    
    protected deleteCancelTokens(
        options: IApiRequestOptions,
        uniqueKey: string
    ) {
        const key = this.createCancelTokenKey(options, uniqueKey);
        this.cancelTokens.delete(key);
    }
    
    protected registerCancelToken(token: CancelTokenSource, key: string) {
        if (!this.cancelTokens.has(key)) {
            this.cancelTokens.set(key, []);
        }

        const tokenList = this.cancelTokens.get(key);
        if (tokenList) {
            tokenList.push(token);
        }
    }

    protected handleCancelation(
        options: IApiRequestOptions,
        uniqueKey: string
    ): CancelTokenSource {
        const source = EnterpriseApiHelper.createCancelToken();

        const key = this.createCancelTokenKey(options, uniqueKey);
        this.cancelPreviousPromises(key);
        this.registerCancelToken(source, key);
        return source;
    }

}