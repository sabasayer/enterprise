import { PatientCollectionProvider } from "./patient-collection-provider";
import { Patient } from "./patient";
import { PatientCollectionLogic } from "./patient-collection-logic";

export class PatientListComponent {
    data: Patient[] = [];

    constructor() {
        //get data

        const button = document.createElement("button");
        button.textContent = "Refresh";
        button.classList.add("refresh");
        document.body.prepend(button);

        this.getData();
        this.handleClick();
    }

    handleClick() {
        let num = 1;
        window.onload = () => {
            document
                .querySelector(".refresh")
                ?.addEventListener("click", async () => {
                    console.log("click");
                    this.getData(num.toString());
                    num++;
                });
        };
    }

    async getData(id?: string) {
        const result = await PatientCollectionLogic.instance.get(
            { key: [id] },
            { cancelTokenUniqueKey: "1" }
        );

        if (result.errorMessages || result.canceled) {
            console.log(result);
            return;
        }

        this.data = result.data;
        this.render();
    }

    render() {
        this.data.forEach((item) => {
            const node = document.createElement("div");
            node.innerHTML = `<div>${item.id} ${item.name} </div>`;
            document.body.append(node);
        });
    }
}
