import { mapField } from "./map-field.interface";
import { MapOptions } from "./map-options.interface";

export type EnterpriseMapperOptions<TModel, TViewModel> = {
    toViewModel?: MapOptions<TModel, TViewModel>;
    toModel?: MapOptions<TViewModel, TModel>;
};
