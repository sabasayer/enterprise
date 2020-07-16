import { EnterpriseDataHouse } from "../enterprise-data-house";
import { EnumCacheType, ExtendArray } from "@sabasayer/utils";

new ExtendArray();

describe("Enterprise Data House", () => {

    it("should store data at memory", () => {
        const data = [1, 2, 3];
        EnterpriseDataHouse.instance.set(EnumCacheType.Memory, "test", data);
        const result = EnterpriseDataHouse.instance.get(
            EnumCacheType.Memory,
            "test"
        );

        expect(result).toEqual(data);
    });

    it("should store data at browser storage", () => {
        const data = ["a", "b", "c"];

        EnterpriseDataHouse.instance.set(
            EnumCacheType.SessionStorage,
            "alphabet",
            data
        );
        const result = EnterpriseDataHouse.instance.get(
            EnumCacheType.SessionStorage,
            "alphabet"
        );

        expect(result).toEqual(data);
    });

    it("should clear data", () => {
        const data = [1, 2, 3];
        EnterpriseDataHouse.instance.set(EnumCacheType.Memory, "test", data);
        EnterpriseDataHouse.instance.clear(EnumCacheType.Memory, "test");
        const result = EnterpriseDataHouse.instance.get(
            EnumCacheType.Memory,
            "test"
        );

        expect(result).toHaveLength(0);
    });

    it("should remove items", () => {
        const data = [
            {
                id: 1,
            },
            {
                id: 2,
            },
        ];

        EnterpriseDataHouse.instance.set(EnumCacheType.Memory, "test2", data);
        EnterpriseDataHouse.instance.removeItems<{ id: number }>(
            EnumCacheType.Memory,
            "test2",
            (e) => e.id == 2
        );
        const result = EnterpriseDataHouse.instance.get(
            EnumCacheType.Memory,
            "test2"
        );

        expect(result).toEqual([{ id: 1 }]);
    });

    it("should add items", () => {
        const data = [{ id: 1 }, { id: 2 }];

        const newData = [{ id: 3 }, { id: 4 }];

        const expected = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

        EnterpriseDataHouse.instance.set(EnumCacheType.Memory, "test3", data);
        EnterpriseDataHouse.instance.addItems<{ id: number }>(
            EnumCacheType.Memory,
            "test3",
            newData
        );

        const result = EnterpriseDataHouse.instance.get(
            EnumCacheType.Memory,
            "test3"
        );

        expect(result).toEqual(expected);
    });

    it("should add items with compare func", () => {
        const data = [{ id: 1 }, { id: 2 }];

        const newData = [{ id: 1 }, { id: 3 }];

        const expected = [{ id: 1 }, { id: 2 }, { id: 3 }];

        EnterpriseDataHouse.instance.set(EnumCacheType.Memory, "test3", data);
        EnterpriseDataHouse.instance.addItems<{ id: number }>(
            EnumCacheType.Memory,
            "test3",
            newData,
            (cachedItem, newItem) => cachedItem.id == newItem.id
        );

        const result = EnterpriseDataHouse.instance.get(
            EnumCacheType.Memory,
            "test3"
        );

        expect(result).toEqual(expected);
    });
});
