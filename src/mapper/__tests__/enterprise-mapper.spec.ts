import { createMock, IMockData } from "../mocks/mock";
import { EnterpriseMapper } from "../enterprise-mapper";

describe("Enterprise Mapper", () => {
    it("should map all fields", () => {
        const data = createMock(1);

        const mapper = new EnterpriseMapper<IMockData, IMockData>({});

        const mapped = mapper.mapToVm(data);
        const mappedReverse = mapper.mapToModel(data);

        expect(mapped).toEqual(data);
        expect(mappedReverse).toEqual(data);
    });

    it("should ignore fields", () => {
        const data = createMock(2);

        const mapper = new EnterpriseMapper<IMockData, IMockData>({
            toViewModel: {
                ignoredFields: ["date", "name"],
            },
        });

        const mapped = mapper.mapToVm(data);
        const expected: Partial<IMockData> = {
            id: data.id,
            myObj: data.myObj,
        };

        expect(mapped).toEqual(expected);
    });

    it("should run mapField functions for fields", () => {
        const data = createMock(3);

        const mapper = new EnterpriseMapper<IMockData, IMockData>({
            toViewModel: {
                mappers: {
                    id: (model, field) => (field ? model[field] + 10 : 0),
                },
            },
        });

        const mapped = mapper.mapToVm(data);

        let expected = { ...data };
        expected.id += 10;

        expect(mapped).toEqual(expected);
    });

    it("should use mapFields strings", () => {
        const data = createMock(3);

        const mapper = new EnterpriseMapper<IMockData, { testField: string }>({
            toViewModel: {
                ignoredFields: ["myObj", "id", "date", "name"],
                mappers: {
                    testField: "name",
                },
            },
        });

        const mapped = mapper.mapToVm(data);
        expect(mapped).toEqual({ testField: data.name });
    });
});
