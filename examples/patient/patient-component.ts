import { PatientCollectionProvider } from "./patient-collection-provider";
import { Patient } from "./patient";

export class PatientComponent {
    id: string;
    data: Partial<Patient> = {};

    constructor(id: string) {
        this.id = id;
        this.getData();
    }

    async getData() {
        const result = await PatientCollectionProvider.instance.get({}, { ids: [this.id] });

        if (result.error) {
            console.log(result);
            return;
        }

        this.data = result.data[0];
        this.render();
    }

    render() {
        const node = document.createElement('div');
        node.innerHTML = `<h4>Patient:</h4><div>${this.data.id} ${this.data.name}</div>`;
        document.body.append(node)
    }
}