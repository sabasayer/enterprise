import cloneDeep from "lodash/cloneDeep";

export abstract class EnterpriseUtils {
    static clone<TModel>(object: TModel): TModel {
        return cloneDeep(object);
    }
}
