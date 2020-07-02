import { EnterpriseApi } from '../enterpise-api';
import { EnterpriseApiHelper } from '../enterprise-api.helper';


describe("Enterprise Api Helper ", () => {
    it("should convert data to query string", async () => {

        const data = { name: 'salih', age: 2 };
        const url: string = '//my-site.com/';

        const convertedUrl = EnterpriseApiHelper.createUrl(url,data);
        expect(convertedUrl).toBe('//my-site.com/?name=salih&age=2');
    })
})