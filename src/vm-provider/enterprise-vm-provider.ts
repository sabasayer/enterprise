import { EnterpirseVmProviderOptions } from "./enterprise-vm-provider.options";
import { MapOptions } from "./map-options.interface";
import cloneDeep from "lodash/clonedeep";

export class EnterpriseVmProvider<TModel, TViewModel> {
    private options: EnterpirseVmProviderOptions<TModel, TViewModel>;
    constructor(options: EnterpirseVmProviderOptions<TModel, TViewModel>) {
        this.options = options;
    }

    defaultViewModel?():TViewModel

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
        const clone = (cloneDeep(model) as unknown) as TModel2;

        options?.ignoredFields?.forEach((ingoredField) => {
            delete clone[ingoredField];
        });

        if (options?.mappers) {
            for (let key in options.mappers) {
                const mapField = options.mappers[key];
                if (mapField) {
                    clone[key] = mapField(model, key);
                }
            }
        }

        return clone;
    }
}
