import mockAxios from "jest-mock-axios";
import { EnterpriseApi } from "../../api";
import { EnterpriseCollectionProvider } from "../collection/enterprise-collection-provider";
import { IMockData } from "../mocks/mock";
import { EnumCacheType, ExtendArray } from "@sabasayer/utils";
import { EnumProvideFromCacheStrategy } from "../collection/enums/provide-from-cache-strategy.enum";
import { EnterpriseDataHouse } from "../enterprise-data-house";

const enterpriseApi = new EnterpriseApi({
    baseUrl: "http://test.com",
});

describe("EnterpriseCollectionProvider", () => {
    afterEach(() => {
        mockAxios.reset();
        EnterpriseDataHouse.instance.clear(EnumCacheType.Memory, "test");
    });

    it("should call get", () => {
        const provider = new EnterpriseCollectionProvider<IMockData>(
            enterpriseApi,
            { typename: "test", getRequestOptions: { url: "test" } }
        );

        provider.get({});

        expect(mockAxios.post).toHaveBeenCalledWith("test", {}, undefined);
    });

    it("should call save", () => {
        const provider = new EnterpriseCollectionProvider<IMockData>(
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
        const provider = new EnterpriseCollectionProvider<IMockData>(
            enterpriseApi,
            { typename: "test", deleteRequestOptions: { url: "deleteTest" } }
        );

        provider.delete({ id: 1 });

        expect(mockAxios.post).toHaveBeenCalledWith(
            "deleteTest",
            { id: 1 },
            undefined
        );
    });

    it("should call get when cache is empty and set data to cache is true", () => {
        const provider = new EnterpriseCollectionProvider<IMockData>(
            enterpriseApi,
            {
                typename: "test",
                cacheStrategy: EnumCacheType.Memory,
                getRequestOptions: { url: "getTests" },
            }
        );

        provider.get({});

        expect(mockAxios.post).toHaveBeenCalledWith("getTests", {}, undefined);
    });

    it("should get data from cache and should'nt call get request", () => {
        const provider = new EnterpriseCollectionProvider<IMockData>(
            enterpriseApi,
            {
                typename: "test",
                cacheStrategy: EnumCacheType.Memory,
                getRequestOptions: { url: "getTests" },
            }
        );

        provider.setCache([{ name: "test", id: 1 }]);

        provider.get({});

        expect(mockAxios.post).toHaveBeenCalledTimes(0);
    });

    it("should not get data from cache and calls get when forceGetFromApi is true", () => {
        const provider = new EnterpriseCollectionProvider<IMockData>(
            enterpriseApi,
            {
                typename: "test",
                cacheStrategy: EnumCacheType.Memory,
                getRequestOptions: { url: "getTests" },
            }
        );

        provider.setCache([{ id: 1, name: "test" }]);

        provider.get({}, { forceGetFromApi: true });

        expect(mockAxios.post).toHaveBeenCalledWith("getTests", {}, undefined);
    });

    it("should call get when items from cache is lacking", () => {
        const provider = new EnterpriseCollectionProvider<IMockData>(
            enterpriseApi,
            {
                typename: "test",
                cacheStrategy: EnumCacheType.Memory,
                getRequestOptions: { url: "getTests" },
                provideFromCacheStrategy:
                    EnumProvideFromCacheStrategy.CollectionId,
                idField: "id",
            }
        );

        provider.setCache([{ id: 1, name: "test" }]);

        provider.get({}, { ids: [2] });

        expect(mockAxios.post).toHaveBeenCalledWith("getTests", {}, undefined);
    });

    it("should set data to cache on save", async () => {
        const provider = new EnterpriseCollectionProvider<IMockData>(
            enterpriseApi,
            {
                typename: "test",
                cacheStrategy: EnumCacheType.Memory,
                saveRequestOptions: { url: "saveTests" },
                provideFromCacheStrategy:
                    EnumProvideFromCacheStrategy.CollectionId,
                idField: "id",
            }
        );

        const data: IMockData = { id: 1, name: "new item" };

        const request = provider.save<{ id: number }>(
            { item: data },
            (response) => {
                const newData = { id: response.id, name: data.name };
                return [newData];
            }
        );

        mockAxios.mockResponse({ data: { id: 15 } });

        await request;

        const cachedItems = provider.getFromCache();

        expect(cachedItems[0]).toEqual({ id: 15, name: data.name });
    });

    it("should remove data from cache on delete", async () => {
        const provider = new EnterpriseCollectionProvider<IMockData>(
            enterpriseApi,
            {
                typename: "test",
                cacheStrategy: EnumCacheType.Memory,
                deleteRequestOptions: { url: "deleteTests" },
                provideFromCacheStrategy:
                    EnumProvideFromCacheStrategy.CollectionId,
                idField: "id",
            }
        );

        provider.setCache([{ id: 1, name: "test" }]);

        const request = provider.delete({ id: 1 }, [1]);
        mockAxios.mockResponse({ data: { id: 1 } });

        await request;

        const data = provider.getFromCache();
        expect(data).toHaveLength(0);
    });
});
