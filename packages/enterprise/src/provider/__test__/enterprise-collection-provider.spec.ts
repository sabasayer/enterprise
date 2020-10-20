import mockAxios from "jest-mock-axios";
import { EnterpriseApi, ServiceRequest } from "../../api";
import { EnterpriseCollectionProvider } from "../collection/enterprise-collection-provider";
import { IMockData } from "../../data-house/mocks/mock";
import { EnumCacheType, ExtendArray } from "@sabasayer/utils";
import { EnumProvideFromCacheStrategy } from "../collection/enums/provide-from-cache-strategy.enum";
import { EnterpriseDataHouse } from "../../data-house/enterprise-data-house";
import {
    IEnterpriseSubscription,
    EnterpriseObservable,
} from "../../data-house/observable";

const enterpriseApi = new EnterpriseApi({
    baseUrl: "http://test.com",
});

describe("EnterpriseCollectionProvider", () => {
    afterEach(() => {
        mockAxios.reset();
        EnterpriseDataHouse.instance.clear(EnumCacheType.Memory, "test");
    });

    it("should call get", () => {
        const provider = new EnterpriseCollectionProvider<IMockData, {}>(
            enterpriseApi,
            { typename: "test", getRequestOptions: { url: "test" } }
        );

        provider.get({});

        expect(mockAxios.post).toHaveBeenCalledWith("test", {}, undefined);
    });

    it("should call save", () => {
        const provider = new EnterpriseCollectionProvider<IMockData, any, any>(
            enterpriseApi,
            { typename: "test", saveRequestOptions: { url: "saveTest" } }
        );

        const request = { test: { id: 1 } };

        provider.save(request);

        expect(mockAxios.post).toHaveBeenCalledWith(
            "saveTest",
            request,
            undefined
        );
    });

    it("should call delete", () => {
        const provider = new EnterpriseCollectionProvider<
            IMockData,
            any,
            ServiceRequest<any,any>,
            ServiceRequest<any,any>
        >(enterpriseApi, {
            typename: "test",
            deleteRequestOptions: { url: "deleteTest" },
        });

        provider.delete({ id: 1 });

        expect(mockAxios.post).toHaveBeenCalledWith(
            "deleteTest",
            { id: 1 },
            undefined
        );
    });

    it("should call get when cache is empty and set data to cache is true", () => {
        const provider = new EnterpriseCollectionProvider<
            IMockData,
            any,
            any,
            any
        >(enterpriseApi, {
            typename: "test",
            cacheStrategy: EnumCacheType.Memory,
            getRequestOptions: { url: "getTests" },
        });

        provider.get({});

        expect(mockAxios.post).toHaveBeenCalledWith("getTests", {}, undefined);
    });

    it("should get data from cache and should'nt call get request", () => {
        const provider = new EnterpriseCollectionProvider<
            IMockData,
            any,
            any,
            any
        >(enterpriseApi, {
            typename: "test",
            cacheStrategy: EnumCacheType.Memory,
            getRequestOptions: { url: "getTests" },
        });

        provider.setCache([{ name: "test", id: 1 }]);

        provider.get({});

        expect(mockAxios.post).toHaveBeenCalledTimes(0);
    });

    it("should not get data from cache and calls get when forceGetFromApi is true", () => {
        const provider = new EnterpriseCollectionProvider<
            IMockData,
            any,
            any,
            any
        >(enterpriseApi, {
            typename: "test",
            cacheStrategy: EnumCacheType.Memory,
            getRequestOptions: { url: "getTests" },
        });

        provider.setCache([{ id: 1, name: "test" }]);

        provider.get({}, { forceGetFromApi: true });

        expect(mockAxios.post).toHaveBeenCalledWith("getTests", {}, undefined);
    });

    it("should call get when items from cache is lacking", () => {
        const provider = new EnterpriseCollectionProvider<
            IMockData,
            any,
            any,
            any
        >(enterpriseApi, {
            typename: "test",
            cacheStrategy: EnumCacheType.Memory,
            getRequestOptions: { url: "getTests" },
            provideFromCacheStrategy: EnumProvideFromCacheStrategy.CollectionId,
            idField: "id",
        });

        provider.setCache([{ id: 1, name: "test" }]);

        provider.get({}, { ids: [2] });

        expect(mockAxios.post).toHaveBeenCalledWith("getTests", {}, undefined);
    });

    it("should set data to cache on save", async () => {
        const provider = new EnterpriseCollectionProvider<
            IMockData,
            any,
            ServiceRequest<{ item: IMockData }, IMockData>,
            any
        >(enterpriseApi, {
            typename: "test",
            cacheStrategy: EnumCacheType.Memory,
            saveRequestOptions: { url: "saveTests" },
            provideFromCacheStrategy: EnumProvideFromCacheStrategy.CollectionId,
            idField: "id",
        });

        const data: IMockData = { id: 1, name: "new item" };

        const request = provider.save({ item: data }, (response:IMockData) => {
            const newData = { id: response.id, name: data.name };
            return [newData];
        });

        mockAxios.mockResponse({ data: { id: 15 } });

        await request;

        const cachedItems = provider.getFromCache();

        expect(cachedItems[0]).toEqual({ id: 15, name: data.name });
    });

    it("should remove data from cache on delete", async () => {
        const provider = new EnterpriseCollectionProvider<
            IMockData,
            any,
            ServiceRequest<any,any>,
            ServiceRequest<any,any>
        >(enterpriseApi, {
            typename: "test",
            cacheStrategy: EnumCacheType.Memory,
            deleteRequestOptions: { url: "deleteTests" },
            provideFromCacheStrategy: EnumProvideFromCacheStrategy.CollectionId,
            idField: "id",
        });

        provider.setCache([{ id: 1, name: "test" }]);

        const request = provider.delete({ id: 1 }, [1]);
        mockAxios.mockResponse({ data: { id: 1 } });

        await request;

        const data = provider.getFromCache();
        expect(data).toHaveLength(0);
    });

    it("should publish added and removed for subscriptions", async () => {
        const provider = new EnterpriseCollectionProvider<
            IMockData,
            any,
            ServiceRequest<{},IMockData[]>,
            ServiceRequest<{},number>
        >(enterpriseApi, {
            typename: "test",
            saveRequestOptions: { url: "saveTests" },
            deleteRequestOptions: { url: "deleteTests" },
        });

        let addedItem: IMockData = {
            id: 0,
            name: "",
        };

        let removedId: number = 0;

        const subscription: IEnterpriseSubscription<IMockData> = {
            id: "1",
            added: (item) => {
                addedItem = item;
            },
            removed: (id) => {
                removedId = +id;
            },
            sideEffected: () => {},
        };

        provider.subscribe(subscription);

        const saveRequest = provider.save({}, (res: IMockData[]) => {
            return res;
        });

        const savedData: IMockData[] = [
            { id: 1, name: "ali" },
            { id: 2, name: "fatma" },
        ];

        mockAxios.mockResponse({
            data: savedData,
        });

        await saveRequest;

        expect(addedItem).toEqual(savedData[1]);

        const deleteRequet = provider.delete({}, [12]);

        mockAxios.mockResponse({
            data: 12,
        });

        await deleteRequet;

        expect(removedId).toBe(12);
    });

    it("should run side effects for subscriptions", async () => {
        const provider = new EnterpriseCollectionProvider<
            IMockData,
            any,
            ServiceRequest<{},IMockData[]>,
            ServiceRequest<any,any>
        >(enterpriseApi, {
            typename: "test",
            saveRequestOptions: { url: "saveTests" },
            relatedTypes: ["sideType"],
        });

        let isSideEffected: boolean = false;

        const subscription: IEnterpriseSubscription<IMockData> = {
            id: "1",
            added: (item) => {},
            removed: (id) => {},
            sideEffected: () => {
                isSideEffected = true;
            },
        };

        const observable2 = new EnterpriseObservable<IMockData>("sideType");
        observable2.subscribe(subscription);

        const request = provider.save({}, (res: IMockData[]) => {
            return res;
        });

        mockAxios.mockResponse({ data: [] });

        await request;

        expect(isSideEffected).toBe(true);
    });
});
