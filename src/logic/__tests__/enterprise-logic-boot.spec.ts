import { EnterpriseLogic, EnterpriseLogicBoot } from "..";
import { EnterpriseApi } from "../../api";

describe("Enterprise Logic Boot", () => {
    it("should initialize logic", () => {
        let initialized: boolean = false;

        class TestLogic extends EnterpriseLogic {
            constructor(api: EnterpriseApi) {
                initialized = true;
                super(api);
            }
        }

        TestLogic.register();

        EnterpriseLogicBoot.initialize(new EnterpriseApi({ baseUrl: "test" }));

        expect(initialized).toBe(true);
    });
});
