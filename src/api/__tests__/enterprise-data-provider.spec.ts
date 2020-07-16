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
        const request = provider.apiRequest(
            { url: "patient" },
            { id: 1 },
            "1"
        );

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
});
