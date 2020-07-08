import { EnterpriseApi } from "../enterpise-api";
import Axios from "axios";

describe("Enterprise Api", () => {
  it("should create axios ", () => {
    const api = new EnterpriseApi({
      baseUrl: "http://test.com",
    });

    const axios = api.getAxios();
    expect(axios).toBeTruthy();
  });

  it("should ensure last character to be slash", () => {
    const api = new EnterpriseApi({
      baseUrl: "http://test.com",
    });

    const axios = api.getAxios();

    expect(axios?.defaults?.baseURL).toBe("http://test.com/");
  });

  it("should create base url from options", () => {
    const api = new EnterpriseApi({
      protocol: "https",
      hostName: "myWebsite.com",
      languagePrefix: "tr-tr",
      prefix: "json"
    });

    const axios = api.getAxios();

    expect(axios?.defaults?.baseURL).toBe("https://myWebsite.com/tr-tr/json/");
  });

  it("should create base url withouth protocol and language prefix", () => {
    const api = new EnterpriseApi({
      hostName: "myWebsite.com"
    })

    const axios = api.getAxios();

    expect(axios?.defaults?.baseURL).toBe("//myWebsite.com/");
  })

  it("it should create base url from endPoints", () => {
    global.window = Object.create(window);
    const url = "localhost:1234";

    Object.defineProperty(window, 'location', {
      value: {
        host: url
      }
    })

    const api = new EnterpriseApi({
      endpoints: {
        'localhost:1234': 'test.com'
      }
    });

    const axios = api.getAxios();

    expect(axios?.defaults?.baseURL).toBe("//test.com/");

  })


  it("should throw error if hostName and baseUrls is empty", () => {

    try {

      const api = new EnterpriseApi({});
    }
    catch (e) {
      expect(e.message).toBe('hostName , endPoints or baseUrl is required')
    }
  })


  it("should set headers", () => {
    const api = new EnterpriseApi({
      baseUrl: 'test.com',
      headers: {
        'content-type': "application/json"
      }
    })

    const axios = api.getAxios();

    expect(axios?.defaults?.headers?.['content-type']).toBe('application/json');
  })

  it("should set authToken", () => {
    const api = new EnterpriseApi({ baseUrl: 'test.com', authTokenHeaderKey: 'x-auth-token' });
    api.setAuthToken('test-auth-token');

    const token = api.getAuthToken();
    const headers = api.getAxios()?.defaults?.headers?.['x-auth-token'];

    expect(token).toBe('test-auth-token');
    expect(headers).toBe('test-auth-token');
  })

});
