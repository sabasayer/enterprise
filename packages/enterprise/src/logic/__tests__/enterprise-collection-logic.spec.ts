import { createMock } from "../../data-house/mocks/mock";
import { MockLogic, IMockVmData } from "../mocks/enterprise-logic.mock";
import { MockEnterpriseApi } from "../../api/mocks/mock";
import { EnterpriseLogicBoot } from "../dependency-injection/enterprise-logic.boot";

describe("Enterprise Collection Logic", () => {
    const api = new MockEnterpriseApi();
    EnterpriseLogicBoot.initialize(api);

    it("should map after get", async () => {
        const mockData = createMock(1);

        const res = await MockLogic.instance.get?.(mockData);

        expect(res?.data?.every((d) => d.testField.includes("test"))).toBe(true);
    });

    it("should getOne", async () => {
        const mockData = createMock(1);

        const res = await MockLogic.instance.getOne?.(mockData);

        const firstData = mockData[0];
        const expected: IMockVmData = {
            testField: `${firstData.id}_${firstData.name}`,
        };

        expect(res?.data).toEqual(expected);
    });

    it("should validate before save", async () => {
        const res = await MockLogic.instance.saveOne?.({ testField: "ali" }, (model) => [model]);

        const errorMessageKeys = Object.keys(res?.errorMessages ?? {});

        expect(errorMessageKeys).toContain("ali");
    });

    it("should validate before saveMany", async () => {
        const res = await MockLogic.instance.save?.(
            [{ testField: "ali" }, { testField: "veli" }],
            (model) => model
        );

        const errorMessageKeys = Object.keys(res?.errorMessages ?? {});

        expect(errorMessageKeys).toHaveLength(2);
    });
});
