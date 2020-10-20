import {
    EnterpriseCollectionProvider,
    IEnterpriseApi,
    EnterpriseCollectionLogic,
} from "./index";

interface Model {
    name: string;
}

interface GetRequest {}

interface SaveRequest {
    models: Model[];
}

interface SaveResponse {
    ids: number[];
}

interface DeleteRequest {
    ids: number[];
}

interface DeleteResponse {
    ids: Record<number, boolean>;
}

class TestProvider extends EnterpriseCollectionProvider<
    Model,
    GetRequest,
    SaveRequest,
    DeleteRequest,
    SaveResponse,
    DeleteResponse
> {
    constructor(api: IEnterpriseApi) {
        super(api, {
            typename: "model",
        });
    }
}

class TestLogic extends EnterpriseCollectionLogic<Model, TestProvider> {
    static instance: TestLogic;

    constructor(api: IEnterpriseApi) {
        super(api, TestProvider);
    }
}

TestLogic.instance.get({});
TestLogic.instance.save([], (models) => ({
    models,
}));
TestLogic.instance.delete({ ids: [] });
