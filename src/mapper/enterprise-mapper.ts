import { EnterpriseMapperOptions } from "./enterprise-mapper.options";
import { MapOptions } from "./map-options.interface";
import cloneDeep from "lodash/clonedeep";

export class EnterpriseMapper<TModel, TViewModel> {
    private options: EnterpriseMapperOptions<TModel, TViewModel>;
    constructor(options: EnterpriseMapperOptions<TModel, TViewModel>) {
        this.options = options;
    }

    defaultViewModel?(): TViewModel;

    mapToVm(model: TModel): TViewModel {
        return this.map(model, this.options.toViewModel);
    }

    mapToModel(model: TViewModel): TModel {
        return this.map(model, this.options.toModel);
    }

    private map<TModel1, TModel2>(
        model: TModel1,
        options?: MapOptions<TModel1, TModel2>
    ): TModel2 {
        let clone = {} as TModel2;

        if (!options?.onlyMapDefinedFields) {
            for (let key in model) {
                const hasMapField = (options?.mappers as
                    | Object
                    | undefined)?.hasOwnProperty(key);
                const isIgnoredField = options?.ignoredFields?.some(
                    (e) => e == key
                );

                if (!isIgnoredField && !hasMapField) {
                    clone[(key as unknown) as keyof TModel2] = cloneDeep(
                        model[key] as any
                    );
                }
            }
        }

        if (options?.mappers) {
            for (let key in options.mappers) {
                const mapField = options.mappers[key];
                if (mapField) {
                    if (typeof mapField == "function") {
                        clone[key] = mapField(model, key);
                    } else {
                        clone[key] = model[mapField as keyof TModel1] as any;
                    }
                }
            }
        }

        return clone;
    }
}
