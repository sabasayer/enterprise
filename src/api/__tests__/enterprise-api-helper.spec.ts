import { EnterpriseApi } from '../enterpise-api';
import { EnterpriseApiHelper } from '../enterprise-api.helper';
import {CancelTokenSource} from 'axios';


describe("Enterprise Api Helper ", () => {
    global.window = Object.create(window);

    Object.defineProperty(window, 'location', {
        value: {
            host: 'test.com'
        }
    });

    it("should convert data to query string", async () => {

        const data = { name: 'salih', age: 2 };
        const url: string = '//my-site.com/';

        const convertedUrl = EnterpriseApiHelper.createUrl(url, data);
        expect(convertedUrl).toBe('//my-site.com/?name=salih&age=2');
    })

    it("should ensure last character to be slash", () => {

        const result = EnterpriseApiHelper.ensureLastCharacterToBeSlash('//test.com');

        expect(result).toBe('//test.com/')
    })

    it("should get hostname from end points", () => {

        const result = EnterpriseApiHelper
            .getHostNameFromEndPoints({ 'asd.com': 'forest.com', 'test.com': 'wololo.com' });

        expect(result).toBe('wololo.com')
    })

    it("should create base url from baseUrl", () => {
        const result = EnterpriseApiHelper.createBaseUrl({
            baseUrl: 'https://test.com'
        });

        expect(result).toBe('https://test.com/')
    })

    it("should create base url from host, protocol, prefix", () => {
        const result = EnterpriseApiHelper.createBaseUrl({
            protocol: 'http',
            hostName: 'test.com',
            prefix: 'json'
        });

        expect(result).toBe('http://test.com/json/')
    })

    it("should create base url with end points", () => {
        const result = EnterpriseApiHelper.createBaseUrl({
            endpoints: {
                'test.com': 'testoloji.com'
            },
            languagePrefix: 'en-us'
        })

        expect(result).toBe('//testoloji.com/en-us/')
    })

    it("should create unique key", () => {
        const key = EnterpriseApiHelper.createUniqueKey('https://test.com', { id: 1 });

        expect(key).toBe('2_https://test.com_{"id":1}')
    })

    it("should create cancel token",()=>{
        const token = EnterpriseApiHelper.createCancelToken();

        expect(token.cancel).toBeDefined()
    })
})