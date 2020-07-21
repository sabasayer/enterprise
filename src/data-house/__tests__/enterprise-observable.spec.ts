import { EnterpriseObservable } from "../observable/enterprise-observable";
import { IEnterpriseSubscription } from "../observable";

describe("EnterpriseObservable", () => {
    let observable: EnterpriseObservable<string>;

    beforeEach(() => {
        observable = new EnterpriseObservable<string>("test");
    });

    it("should publish added and removed", () => {
        let addedValue: string = "";
        let removedValue: string = "";

        const added = (item: string) => {
            addedValue = item;
        };

        const removed = (item: string | number) => {
            removedValue = item + "";
        };

        observable.subscribe({ id: "1", added, removed, sideEffected: () => {} });
        observable.added("12");
        observable.removed("23");

        expect(addedValue).toBe("12");
        expect(removedValue).toBe("23");
    });

    it("should publish sideEffect", () => {
        let isSideEffected: boolean = false;
        const sub1: IEnterpriseSubscription<string> = {
            id: "sub1",
            added: (item: string) => {},
            removed: (id: string | number) => {},
            sideEffected: () => {
                isSideEffected = true;
            },
        };

        observable.subscribe(sub1);

        observable.sideEffected();

        expect(isSideEffected).toBe(true);
    });

    it("should publish to multiple subscriber", () => {
        const items1: string[] = [];
        const items2: string[] = [];

        const sub1: IEnterpriseSubscription<string> = {
            id: "sub1",
            added: (item: string) => items1.push(item),
            removed: (id: string | number) => {},
            sideEffected: () => {},
        };

        const sub2: IEnterpriseSubscription<string> = {
            id: "sub2",
            added: (item: string) => items2.push(item),
            removed: (id: string | number) => {},
            sideEffected: () => {},
        };

        observable.subscribe(sub1);
        observable.subscribe(sub2);

        observable.added("12");

        expect(items1).toEqual(["12"]);
        expect(items2).toEqual(["12"]);
    });

    it("should publish addedMany and removedMany", () => {
        let addedValues: string[] = [];
        let removedValues: string[] = [];

        const added = (item: string) => {
            addedValues.push(item);
        };

        const removed = (item: string | number) => {
            removedValues.push(item + "");
        };

        observable.subscribe({ id: "1", added, removed, sideEffected: () => {} });
        observable.addedMany(["1", "2", "3"]);
        observable.removedMany(["4", "5", "6"]);

        expect(addedValues).toEqual(["1", "2", "3"]);
        expect(removedValues).toEqual(["4", "5", "6"]);
    });

    it("should publish after filtering with filter function", () => {
        let addedValue: string = "";
        let removedValue: string = "";

        const added = (item: string) => {
            addedValue = item;
        };

        const removed = (item: string | number) => {
            removedValue = item + "";
        };

        const filterFunc = (item: string) => item.indexOf("a") > -1;

        observable.subscribe({
            id: "1",
            added,
            removed,
            filterFunc,
            sideEffected: () => {},
        });
        observable.added("33");
        observable.removed("44");

        expect(addedValue).toBe("");
        expect(removedValue).toBe("44");
    });

    it("should unsubscribe", () => {
        let addedValue: string = "";
        let removedValue: string = "";

        const added = (item: string) => {
            addedValue = item;
        };

        const removed = (item: string | number) => {
            removedValue = item + "";
        };

        observable.subscribe({ id: "3", added, removed, sideEffected: () => {} });
        observable.unsubscribe("3");
        observable.added("12");
        observable.removed("23");

        expect(addedValue).toBe("");
        expect(removedValue).toBe("");
    });
});
