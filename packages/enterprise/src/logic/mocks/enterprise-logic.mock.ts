import {  IEnterpriseApi, ServiceRequest } from "../../api";
import { EnterpriseCollectionProvider } from "../../provider/collection";
import { IMockData } from "../../data-house/mocks/mock";
import { EnterpriseCollectionLogic, IValidationResult } from "..";
import { EnterpriseMapper } from "../../mapper";

class MockMapper extends EnterpriseMapper<IMockData, IMockVmData> {
    constructor() {
        super({
            toViewModel: {
                onlyMapDefinedFields: true,
                mappers: {
                    testField: (model) => `${model.id}_${model.name}`,
                },
            },
        });
    }
}

class MockCollectionProvider extends EnterpriseCollectionProvider<
    IMockData,
    {},
    ServiceRequest<IMockData[], IMockData[]>
> {
    constructor(api: IEnterpriseApi) {
        super(api, {
            typename: "test",
            getRequestOptions: { url: "get" },
            saveRequestOptions: { url: "save" },
        });
    }
}

export interface IMockVmData {
    testField: string;
    otherField?: string;
}

export class MockLogic extends EnterpriseCollectionLogic<IMockData, MockCollectionProvider, IMockVmData> {
    static instance: MockLogic;

    constructor(api: IEnterpriseApi) {
        super(api, MockCollectionProvider, MockMapper, "testField");
    }

    validate(model: IMockVmData): IValidationResult {
        if (model.testField.includes("test")) return { valid: true };

        return {
            valid: false,
            errorMessages: {
                testField: "should containt test text",
            },
        };
    }
}

MockLogic.register();
