import {EnterpriseDataHouse} from '../enterprise-data-house'
import { EnumCacheType } from '@sabasayer/utils';

describe("Enterprise Data House", () => {
    it("should store data at memory", () => {
        const data = [1, 2, 3];
        EnterpriseDataHouse.instance.set(EnumCacheType.Memory, 'test', data);
        const result = EnterpriseDataHouse.instance.get(EnumCacheType.Memory, 'test');

        expect(result).toEqual(data)
    })

    it("should clear data", () => {
        const data = [1, 2, 3];
        EnterpriseDataHouse.instance.set(EnumCacheType.Memory, 'test', data);
        EnterpriseDataHouse.instance.clear(EnumCacheType.Memory, 'test');
        const result = EnterpriseDataHouse.instance.get(EnumCacheType.Memory, 'test');

        expect(result).toHaveLength(0)
    })

    it("should store data at session storage",()=>{

        expect(false).toBe(true)
    })

    it("should store data at local storage",()=>{

        expect(false).toBe(true)
    })
})