import { mapField } from "./map-field.interface";

export type MapOptions<TModel1, TModel2> = {
    ignoredFields?: (keyof TModel2)[];
    mappers?: {
        [K in keyof TModel2]?: mapField<TModel1, TModel2, K>;
    };
};
