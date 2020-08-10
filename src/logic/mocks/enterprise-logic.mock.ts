import { EnterpriseApi } from "../../api";
import { EnterpriseCollectionProvider } from "../../data-house";
import { IMockData } from "../../data-house/mocks/mock";
import {
    EnterpriseCollectionLogic,
    IValidationResult,
    EnterpriseLogicBoot,
} from "..";
import { EnterpriseMapper } from "../../mapper";
import { enterpirseBoot } from "../../enterpirse.boot";

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

class MockCollectionProvider extends EnterpriseCollectionProvider<IMockData> {
    constructor(api: EnterpriseApi) {
        super(api, {
            typename: "test",
            getRequestOptions: { url: "get" },
            saveRequestOptions: { url: "save" },
        });
    }
}

export interface IMockVmData {
    testField: string;
}

export class MockLogic extends EnterpriseCollectionLogic<
    IMockData,
    MockCollectionProvider,
    IMockVmData
> {
    static instance: MockLogic;

    constructor(api: EnterpriseApi) {
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
