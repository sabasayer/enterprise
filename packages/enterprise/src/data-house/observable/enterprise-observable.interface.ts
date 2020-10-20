import { IEnterpriseSubscription } from ".";

export interface IEnterpriseObservable<TModel> {
    subscribe(subscription: IEnterpriseSubscription<TModel>): void;

    unsubscribe(id: string): void;

    added(item: TModel): void;

    addedMany(items: TModel[]): void;

    removed(id: string | number): void;

    removedMany(ids: (string | number)[]): void;

    sideEffected(): void;
}
