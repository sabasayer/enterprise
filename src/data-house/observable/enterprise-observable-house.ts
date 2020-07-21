import { EnterpriseObservable } from ".";
import { isDevelopment } from "../../helpers";

declare global {
    interface Window {
        enterpiseObservableHouse: any;
    }
}

export class EnterpriseObservableHouse {
    static instance: EnterpriseObservableHouse;
    private observables: Map<string, EnterpriseObservable<any>> = new Map();

    constructor() {
        if (isDevelopment()) this.debug();
    }

    private debug() {
        window.enterpiseObservableHouse = this;
    }

    private static initialize = (() => {
        EnterpriseObservableHouse.instance = new EnterpriseObservableHouse();
    })();

    register<TModel>(type: string, observable: EnterpriseObservable<TModel>) {
        this.observables.set(type, observable);
    }

    get<TModel>(type: string): EnterpriseObservable<TModel> | never {
        const observable = this.observables.get(type);
        if (!observable)
            throw new Error(`${type} typed observable is not registered`);

        return observable;
    }

    
}
