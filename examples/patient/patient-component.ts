import { Patient } from "./patient";
import { PatientCollectionLogic } from "./patient-collection-logic";

export class PatientComponent {
    id: string;
    data: Partial<Patient> = {};

    constructor(id: string) {
        this.id = id;
        this.getData();
        this.handleClick();
    }

    async getData() {
        const result = await PatientCollectionLogic.instance.get(
            { key: [this.id] },
            "12"
        );

        if (result.errorMessages) {
            console.log(result);
            return;
        }

        if (!result.data[0]) return;

        this.data = result.data[0];
        this.render();
    }

    handleClick() {
        window.onload = () => {
            document
                .querySelector("button.save")
                ?.addEventListener("click", async () => {
                    const result = await PatientCollectionLogic.instance.save({
                        patients: [
                            {
                                id: 156,
                                name: "ali",
                            },
                        ],
                    });

                    if (result.errorMessages)
                        alert(JSON.stringify(result.errorMessages));
                    else alert("saved");
                });

            document
                .querySelector("button.refresh")
                ?.addEventListener("click", async () => {
                    this.getData();
                });
        };
    }

    render() {
        const node = document.createElement("div");
        node.innerHTML = `<h4>Patient:</h4><div>${this.data.id} ${this.data.name}</div><button class='refresh'>Refresh</button><button class='save'>Save</button>`;
        document.body.append(node);
    }
}
