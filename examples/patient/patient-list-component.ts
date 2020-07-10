import { PatientCollectionProvider } from "./patient-collection-provider";
import { Patient } from "./patient";
import { PatientCollectionLogic } from "./patient-collection-logic";

export class PatientListComponent {
    data: Patient[] = [];

    constructor() {
        //get data
        this.getData();
    }

    async getData() {
        const result = await PatientCollectionLogic.instance.get({});

        if (result.errorMessages) {
            console.log(result);
            return;
        }

        this.data = result.data;
        this.render();

    }

    render() {
        this.data.forEach(item => {
            const node = document.createElement('div');
            node.innerHTML = `<div>${item.id} ${item.name} </div>`;
            document.body.append(node)
        })
    }
}
