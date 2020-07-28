import { mapField } from "./map-field.interface";

export type MapOptions<TModel1, TModel2> = {
    onlyMapDefinedFields?: boolean;
    ignoredFields?: (keyof TModel1)[];
    mappers?: {
        [K in keyof TModel2]?: mapField<TModel1, TModel2, K> | keyof TModel1;
    };
};
