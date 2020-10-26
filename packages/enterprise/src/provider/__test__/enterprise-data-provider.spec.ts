import { EnterpriseDataProvider } from "../enterprise-data-provider";
import { EnterpriseApi } from "../../api";
import mockAxios from "jest-mock-axios";
import { IApiRequestOptions } from "..";
import { IMockData } from "../../data-house/mocks/mock";

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
        const request = provider.apiRequest({
            options: { url: "patient" },
            request: { id: 1 },
        });

        expect(mockAxios.post).toHaveBeenCalledWith("patient", { id: 1 }, undefined);

        const expectedResponse = { data: { id: 1, name: "ali" } };

        mockAxios.mockResponse(expectedResponse);

        const response = await request;

        expect(response.data).toEqual(expectedResponse.data);
    });

    it("should call post with cancelToken", async () => {
        const request = provider.apiRequest({
            options: { url: "patient" },
            request: { id: 1 },
            cancelTokenUniqueKey: "1",
        });

        provider.apiRequest({
            options: { url: "patient" },
            request: { id: 2 },
            cancelTokenUniqueKey: "1",
        });

        const result1 = await request;

        expect(result1.canceled).toBeTruthy();
    });

    it("should prevent multiple same request", () => {
        provider.apiRequest({
            options: { url: "patient" },
            request: { id: 1 },
        });
        provider.apiRequest({
            options: { url: "patient" },
            request: { id: 1 },
        });
        provider.apiRequest({
            options: { url: "patient" },
            request: { id: 1 },
        });

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

        const request = provider.apiRequest({
            options: { url: "test" },
            request: {},
        });

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

    it("should validate response", async () => {
        const expectedErrorMessage: Record<string, string> = {
            id: "must bigger then 0",
        };

        const requestOptions: IApiRequestOptions<IMockData> = {
            url: "test",
            responseValidationFn: (result) => {
                if (result?.id)
                    return {
                        valid: true,
                    };

                return {
                    errorMessages: expectedErrorMessage,
                    valid: false,
                };
            },
        };

        const request = provider.apiRequest<{}, IMockData>({
            options: requestOptions,
            request: {},
        });

        const mockData: IMockData = {
            name: "test",
            id: 0,
        };

        mockAxios.mockResponse({ data: mockData });

        const response = await request;

        expect(response.errorMessages).toEqual(expectedErrorMessage);
    });
});
