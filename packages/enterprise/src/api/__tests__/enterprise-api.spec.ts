import { EnterpriseApi } from "../enterpise-api";
import mockAxios from "jest-mock-axios";

describe("Enterprise Api", () => {
    afterEach(() => {
        mockAxios.reset();
    });

    it("should set headers", () => {
        const api = new EnterpriseApi({
            baseUrl: "test.com",
            headers: {
                "content-type": "application/json",
            },
        });

        expect(mockAxios.create).toHaveBeenCalledWith({
            baseURL: "test.com/",
            headers: {
                "content-type": "application/json",
            },
        });

        api.setHeader("x-my-key", "1");

        const axios = api.getAxios();

        expect(axios?.defaults?.headers?.["x-my-key"]).toBe("1");
    });

    it("should initialize axios again with options", () => {
        const api = new EnterpriseApi({
            baseUrl: "test.com",
        });

        const options = {
            baseUrl: "second.com",
            headers: {
                "x-auth-token": "test",
            },
        };

        api.setOptions(options);

        expect(mockAxios.create).toHaveBeenCalledWith({
            baseURL: "second.com/",
            headers: {
                "x-auth-token": "test",
            },
        });

        expect(api.getOptions()).toEqual(options);
    });

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

        api.getAxios();

        expect(mockAxios.create).toHaveBeenCalledWith({
            baseURL: "http://test.com/",
        });
    });

    it("should create axios with hostName ", () => {
        new EnterpriseApi({
            hostName: "wololo.com",
        });

        expect(mockAxios.create).toHaveBeenCalledWith({
            baseURL: "//wololo.com/",
        });
    });

    it("should create base url from options", () => {
        const api = new EnterpriseApi({
            protocol: "https",
            hostName: "myWebsite.com",
            languagePrefix: "tr-tr",
            prefix: "json",
        });

        api.getAxios();

        expect(mockAxios.create).toHaveBeenCalledWith({
            baseURL: "https://myWebsite.com/tr-tr/json/",
        });
    });

    it("should create base url withouth protocol and language prefix", () => {
        const api = new EnterpriseApi({
            hostName: "myWebsite.com",
        });

        api.getAxios();

        expect(mockAxios.create).toHaveBeenCalledWith({
            baseURL: "//myWebsite.com/",
        });
    });

    it("it should create base url from endPoints", () => {
        global.window = Object.create(window);
        const url = "localhost:1234";

        Object.defineProperty(window, "location", {
            value: {
                host: url,
            },
        });

        const api = new EnterpriseApi({
            endpoints: {
                "localhost:1234": "test.com",
            },
        });

        api.getAxios();

        expect(mockAxios.create).toHaveBeenCalledWith({
            baseURL: "//test.com/",
        });
    });

    it("should throw error if hostName and baseUrls is empty", () => {
        try {
            new EnterpriseApi({});
        } catch (e) {
            expect(e.message).toBe(
                "hostName , endPoints or baseUrl is required"
            );
        }
    });

    it("should set authToken", () => {
        const api = new EnterpriseApi({
            baseUrl: "test.com",
            authTokenHeaderKey: "x-auth-token",
        });
        api.setAuthToken("test-auth-token");

        const token = api.getAuthToken();
        const headers = api.getAxios()?.defaults?.headers?.["x-auth-token"];

        expect(token).toBe("test-auth-token");
        expect(headers).toBe("test-auth-token");
    });

    it("should set data field", () => {
        const api = new EnterpriseApi({
            baseUrl: "test.com",
            dataField: "data",
        });

        const dataField = api.dataField;

        expect(dataField).toBe("data");
    });

    it("should call get and delete with query params", () => {
        const api = new EnterpriseApi({
            baseUrl: "test.com",
        });

        api.get("getData", { id: 1 });
        api.delete("getData", { id: 1 });

        expect(mockAxios.get).toHaveBeenCalledWith("getData?id=1", undefined);
        expect(mockAxios.delete).toHaveBeenCalledWith(
            "getData?id=1",
            undefined
        );
    });

    it("should call post and put with data", () => {
        const api = new EnterpriseApi({
            baseUrl: "test.com",
        });

        api.post("getData", { id: 1 });
        api.put("getData", { id: 1 });

        expect(mockAxios.post).toHaveBeenCalledWith(
            "getData",
            { id: 1 },
            undefined
        );
        expect(mockAxios.put).toHaveBeenCalledWith(
            "getData",
            { id: 1 },
            undefined
        );
    });

    it("should send file data", () => {
        const api = new EnterpriseApi({
            baseUrl: "upload.com",
        });

        const files: File[] = [new File([], "")];
        const data = { id: 1 };

        api.upload("up", files as File[], { id: 1 }, "json");

        let formData = new FormData();

        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i], files[i].name);
        }

        formData.append("json", JSON.stringify(data));

        expect(mockAxios.post).toHaveBeenCalledWith("up", formData, undefined);
    });
});
