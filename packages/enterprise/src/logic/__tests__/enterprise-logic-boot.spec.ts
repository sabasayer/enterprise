import { EnterpriseLogic, EnterpriseLogicBoot } from "..";
import { EnterpriseApi } from "../../api";
import { logic } from "../dependency-injection/logic.decorator";

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

    it("should initialize logic with decorator", () => {
        let initialized: boolean = false;

        @logic
        class TestLogic2 extends EnterpriseLogic {
            static instance: TestLogic2;

            constructor(api: EnterpriseApi) {
                initialized = true;
                super(api);
            }

            test() {
                return "test";
            }
        }

        const res = TestLogic2.instance.test();

        EnterpriseLogicBoot.initialize(new EnterpriseApi({ baseUrl: "test" }));
        expect(initialized).toBe(true);
        expect(res).toBe("test");
    });
});
