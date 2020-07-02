import DataHouse from '../enterprise-data-house'
import { EnumCacheType } from '@sabasayer/utils';

describe("Enterprise Data House", () => {
    it("should store data at memory", () => {
        const data = [1, 2, 3];
        DataHouse.set(EnumCacheType.Memory, 'test', data);
        const result = DataHouse.get(EnumCacheType.Memory, 'test');

        expect(result).toEqual(data)
    })

    it("should clear data", () => {
        const data = [1, 2, 3];
        DataHouse.set(EnumCacheType.Memory, 'test', data);
        DataHouse.clear(EnumCacheType.Memory, 'test');
        const result = DataHouse.get(EnumCacheType.Memory, 'test');

        expect(result).toHaveLength(0)
    })
})