export type mapField<TModel1, TModel2, TModel2Field extends keyof TModel2> = (
    model1: TModel1,
    model2Field?: TModel2Field
) => TModel2[TModel2Field];
