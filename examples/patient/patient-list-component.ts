import { PatientCollectionProvider } from "./patient-collection-provider";
import { Patient } from "./patient";
import { api } from "./main";

export class PatientListComponent {
    data: Patient[] = [];
    provider: PatientCollectionProvider

    constructor() {
        //get data
        this.provider = new PatientCollectionProvider(api);
        this.getData();
    }

    async getData() {
        const result = await this.provider.get({
        });

        if (result.error) {
            console.log(result);
            return;
        }

        this.data = result.data;
        this.render();
    }

    render() {
        this.data.forEach(item => {
            const node = document.createElement('div');
            node.innerHTML = `<div>${item.id} ${item.name}</div>`;
            document.body.append(node)
        })
    }
}
