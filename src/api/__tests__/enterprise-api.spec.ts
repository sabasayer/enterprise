import { EnterpriseApi } from "../enterpise-api";

describe("Enterprise Api", () => {
  it("should create axios ", () => {
    const api = new EnterpriseApi({
      baseUrl: "http://test.com",
    });

    const axios = api.getAxios();
    expect(axios).toBeTruthy();
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

  it("should ensure last character to be slash", () => {
    const api = new EnterpriseApi({
      baseUrl: "http://test.com",
    });

    const axios = api.getAxios();

    expect(axios?.defaults?.baseURL).toBe("http://test.com/");
  });
});
