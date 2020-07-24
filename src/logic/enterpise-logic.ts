import { EnterpriseApi } from "@/api";

export abstract class EnterpirseLogic {
    static instance: EnterpirseLogic;

    static initialize?(api:EnterpriseApi): void;
}
