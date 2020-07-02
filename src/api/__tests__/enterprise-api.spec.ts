import { EnterpriseApi } from "../enterpise-api";

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
    });

    const axios = api.getAxios();

    expect(axios?.defaults?.baseURL).toBe("https://myWebsite.com/tr-tr/");
  });

  it("should create base url withouth protocol and language prefix", () => {
    const api = new EnterpriseApi({
      hostName: "myWebsite.com"
    })

    const axios = api.getAxios();

    expect(axios?.defaults?.baseURL).toBe("//myWebsite.com/");
  })

  it("should throw error if hostName and baseUrls is empty", () => {

    try {

      const api = new EnterpriseApi({});
    }
    catch (e) {
      expect(e.message).toBe('hostName or baseUrl is required')
    }
  })
 
});
