export interface GetCollectionOptions<TModel = undefined> {
    ids?: (string | number)[];
    forceGetFromApi?: boolean;
    cancelTokenUniqueKey?: string;
    filterFunc?: (model: TModel) => boolean;
}
