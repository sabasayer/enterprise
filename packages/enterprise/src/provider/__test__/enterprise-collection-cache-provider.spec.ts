import { EnterpriseCollectionCacheProvider } from "../../data-house/cache/enterprise-collection-cache-provider";
import { EnumCacheType, ExtendArray } from "@sabasayer/utils";
import { EnumProvideFromCacheStrategy } from "../collection/enums/provide-from-cache-strategy.enum";
import { IMockData, createMock } from "../../data-house/mocks/mock";
import { EnterpriseDataHouse } from "../../data-house/enterprise-data-house";

new ExtendArray();

describe("Enterprise Collection Cache Provider", () => {
    it("should set data to cache", () => {
        const data = createMock(1);
        const cacheProvider = new EnterpriseCollectionCacheProvider<IMockData>({
            typename: "test",
            cacheStrategy: EnumCacheType.Memory,
        });

        cacheProvider.setCache(data);
        const cachedData = EnterpriseDataHouse.instance.get(EnumCacheType.Memory, "test");
        const getDataResult = cacheProvider.getFromCache();

        expect(data).toEqual(cachedData);
        expect(getDataResult).toEqual(data);
    });

    it("should remove data from cache", () => {
        const data = createMock(1);
        const cacheProvider = new EnterpriseCollectionCacheProvider<IMockData>({
            typename: "test",
            cacheStrategy: EnumCacheType.Memory,
        });

        cacheProvider.setCache(data);
        cacheProvider.clearCache();

        const cachedData = EnterpriseDataHouse.instance.get(EnumCacheType.Memory, "test");

        expect(cachedData).toHaveLength(0);
    });

    it("should get data by unique key", () => {
        const data = createMock(2);
        const uniqueCacheKey = "unique";

        const data2 = createMock(3);
        const uniqueCacheKey2 = "unique2";

        const cacheProvider = new EnterpriseCollectionCacheProvider<IMockData>({
            typename: "test",
            cacheStrategy: EnumCacheType.Memory,
            provideFromCacheStrategy: EnumProvideFromCacheStrategy.RequestParamsHash,
        });

        cacheProvider.setCache(data, uniqueCacheKey);
        cacheProvider.setCache(data2, uniqueCacheKey2);

        const cachedData = cacheProvider.getFromCache({}, uniqueCacheKey);
        const cachedData2 = cacheProvider.getFromCache({}, uniqueCacheKey2);

        expect(data).toEqual(cachedData);
        expect(data2).toEqual(cachedData2);
    });

    it("should get data with filter func", () => {
        const data = createMock(2);

        const cacheProvider = new EnterpriseCollectionCacheProvider<IMockData>({
            typename: "test",
            cacheStrategy: EnumCacheType.Memory,
            provideFromCacheStrategy: EnumProvideFromCacheStrategy.RequestParamsHash,
        });

        const uniqueCacheKey = "unique";
        cacheProvider.setCache(data, uniqueCacheKey);

        const cachedData = cacheProvider.getFromCache(
            { filterFunc: (model) => (model.id ?? 0) < 4 },
            uniqueCacheKey
        );

        expect(cachedData).toHaveLength(1);
    });

    it("should set and get data by id", () => {
        const data = createMock(10);
        const lastData = data[data.length - 1];

        const cacheProvider = new EnterpriseCollectionCacheProvider<IMockData>({
            typename: "test",
            cacheStrategy: EnumCacheType.Memory,
            provideFromCacheStrategy: EnumProvideFromCacheStrategy.CollectionId,
            idField: "id",
        });

        cacheProvider.setCache(data);
        const cachedData = cacheProvider.getFromCache({ ids: [lastData.id ?? 0] });

        expect(cachedData).toEqual([lastData]);
    });

    it("should remove data by id", () => {
        const data = createMock(11);
        const firstData = data[0];

        const cacheProvider = new EnterpriseCollectionCacheProvider<IMockData>({
            typename: "test",
            cacheStrategy: EnumCacheType.Memory,
            provideFromCacheStrategy: EnumProvideFromCacheStrategy.CollectionId,
            idField: "id",
        });

        cacheProvider.setCache(data);
        cacheProvider.removeItemsFromCache([firstData.id ?? 0]);

        const cachedData = cacheProvider.getFromCache();

        expect(cachedData.some((e) => e.id == firstData.id)).toBeFalsy();
    });

    it("should add new data", () => {
        const data = createMock(20);

        const cacheProvider = new EnterpriseCollectionCacheProvider<IMockData>({
            typename: "test2",
            cacheStrategy: EnumCacheType.Memory,
        });

        const newItem = { id: 900, name: "new item" };

        cacheProvider.setCache(data);
        cacheProvider.addItemsToCache([newItem]);

        const cachedData = cacheProvider.getFromCache();
        const last = cachedData.last();

        expect(last).toEqual(newItem);
    });

    it("should add new data with checking ids", () => {
        const data = createMock(20);
        const lastData = data.last();

        const cacheProvider = new EnterpriseCollectionCacheProvider<IMockData>({
            typename: "test3",
            cacheStrategy: EnumCacheType.Memory,
            provideFromCacheStrategy: EnumProvideFromCacheStrategy.CollectionId,
            idField: "id",
        });

        const newItem = { id: 900, name: "new item" };

        cacheProvider.setCache(data);
        cacheProvider.addItemsToCache([newItem, lastData]);

        const cachedData = cacheProvider.getFromCache();
        const last = cachedData.last();

        expect(last).toEqual(newItem);
        expect(cachedData.filter((e) => e.id == lastData.id)).toHaveLength(1);
    });
});
