export interface IEnterpriseSubscription<TModel> {
    id: string;
    added: (item: TModel) => any;
    removed: (id: string | number) => any;
    sideEffected: () => any;
    filterFunc?: (item: TModel) => boolean;
}
