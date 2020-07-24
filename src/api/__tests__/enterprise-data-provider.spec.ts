import { EnterpriseDataProvider } from "../provider/enterprise-data-provider";
import { EnterpriseApi } from "..";
import mockAxios from "jest-mock-axios";

const enterpriseApi = new EnterpriseApi({
    baseUrl: "http://test.com",
});

describe("Enterprise Data Provider", () => {
    let provider: EnterpriseDataProvider;

    beforeEach(() => {
        provider = new EnterpriseDataProvider(enterpriseApi);
    });

    afterEach(() => {
        mockAxios.reset();
    });

    it("should validate request en return errorMessage", () => {
        //Validation algorithm is not implemented yet
    });

    it("should return data", async () => {
        const request = provider.apiRequest({ url: "patient" }, { id: 1 });

        expect(mockAxios.post).toHaveBeenCalledWith(
            "patient",
            { id: 1 },
            undefined
        );

        const expectedResponse = { data: { id: 1, name: "ali" } };

        mockAxios.mockResponse(expectedResponse);

        const response = await request;

        expect(response.data).toEqual(expectedResponse.data);
    });

    it("should call post with cancelToken", async () => {
        const request = provider.apiRequest({ url: "patient" }, { id: 1 }, "1");

        const request2 = provider.apiRequest(
            { url: "patient" },
            { id: 2 },
            "1"
        );

        const result1 = await request;

        expect(result1.canceled).toBeTruthy();
    });

    it("should prevent multiple same request", () => {
        provider.apiRequest({ url: "patient" }, { id: 1 });
        provider.apiRequest({ url: "patient" }, { id: 1 });
        provider.apiRequest({ url: "patient" }, { id: 1 });

        expect(mockAxios.post).toHaveBeenCalledTimes(1);
    });

    it("should create errorMessages when error and createErrorMessagesFunc defined", async () => {
        const api = new EnterpriseApi({
            baseUrl: "http://test.com",
            createErrorMessagesFunc: (response) => {
                return response.data;
            },
        });

        provider = new EnterpriseDataProvider(api);

        const request = provider.apiRequest({ url: "test" }, {});

        const errorMessage = {
            error: "Error message",
        };

        mockAxios.mockResponse({
            data: errorMessage,
            status: 500,
        });

        const result = await request;

        expect(result.errorMessages).toEqual(errorMessage);
    });
});
