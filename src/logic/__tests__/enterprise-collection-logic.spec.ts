import mockAxios from "jest-mock-axios";
import { enterpirseBoot } from "../../enterpirse.boot";
import { createMock } from "../../data-house/mocks/mock";
import { MockLogic, IMockVmData } from "../mocks/enterprise-logic.mock";

describe("Enterprise Collection Logic", () => {
    enterpirseBoot({
        baseUrl: "test",
    });

    afterEach(() => {
        mockAxios.reset();
    });

    it("should map after get", async () => {
        const mockData = createMock(1);

        const req = MockLogic.instance.get?.({});

        mockAxios.mockResponse({ data: mockData });

        const res = await req;

        expect(res?.data?.every((d) => d.testField.includes("test"))).toBe(
            true
        );
    });

    it("should getOne", async () => {
        const mockData = createMock(1);

        const req = MockLogic.instance.getOne?.({});

        mockAxios.mockResponse({ data: mockData });

        const res = await req;

        const firstData = mockData[0];
        const expected: IMockVmData = {
            testField: `${firstData.id}_${firstData.name}`,
        };

        expect(res?.data).toEqual(expected);
    });

    it("should validate before save", async () => {
        const res = await MockLogic.instance.save?.(
            { testField: "ali" },
            (model) => model
        );

        const errorMessageKeys = Object.keys(res?.errorMessages ?? {});

        expect(errorMessageKeys).toContain("ali");
    });

    it("should validate before saveMany", async () => {
        const res = await MockLogic.instance.saveMany?.(
            [{ testField: "ali" }, { testField: "veli" }],
            (model) => model
        );

        const errorMessageKeys = Object.keys(res?.errorMessages ?? {});

        expect(errorMessageKeys).toHaveLength(2);
    });
});
