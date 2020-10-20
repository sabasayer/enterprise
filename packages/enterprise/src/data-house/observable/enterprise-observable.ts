import { IEnterpriseSubscription } from "./enterprise-subscription.interface";
import { ExtendArray } from "@sabasayer/utils";
import { EnterpriseObservableHouse } from "./enterprise-observable-house";
import { IEnterpriseObservable } from "./enterprise-observable.interface";
new ExtendArray();

/**
 * Enables syncing different ui parts that uses same type of collection data
 */
export class EnterpriseObservable<TModel>
    implements IEnterpriseObservable<TModel> {
    private subscriptions: IEnterpriseSubscription<TModel>[] = [];
    private type: string = "";

    constructor(type: string) {
        this.type = type;
        EnterpriseObservableHouse.instance.register(type, this);
    }

    subscribe(subscription: IEnterpriseSubscription<TModel>) {
        this.subscriptions.pushIf(subscription, (all) =>
            all.every((s) => s.id != subscription.id)
        );
    }

    unsubscribe(id: string) {
        this.subscriptions.findRemove((s) => s.id == id);
    }

    added(item: TModel) {
        this.subscriptions.forEach(
            (sub) => this.canPublish(sub, item) && sub.added(item)
        );
    }

    addedMany(items: TModel[]) {
        items.forEach((item) => this.added(item));
    }

    removed(id: string | number) {
        this.subscriptions.forEach((sub) => sub.removed(id));
    }

    removedMany(ids: (string | number)[]) {
        ids.forEach((id) => this.removed(id));
    }

    sideEffected() {
        this.subscriptions.forEach((sub) => sub.sideEffected());
    }

    private canPublish(
        sub: IEnterpriseSubscription<TModel>,
        item: TModel
    ): boolean {
        return !sub.filterFunc || sub.filterFunc(item);
    }
}
