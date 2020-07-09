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
        const result = await PatientCollectionLogic.instance.get({ key: [this.id] });

        if (result.errorMessages) {
            console.log(result);
            return;
        }

        if(!result.data[0]) return;

        this.data = result.data[0];
        this.render();
    }

    handleClick() {
        window.onload = () => {
            document.querySelector('button')?.addEventListener('click', async () => {
                console.log('click');

                const result = await PatientCollectionLogic.instance.save({
                    patients: [{
                        id: 156,
                        name: 'ali'
                    }]
                })

                if (result.errorMessages)
                    alert(JSON.stringify(result.errorMessages))
                else
                    alert('saved')
            })
        }

    }

    render() {
        const node = document.createElement('div');
        node.innerHTML = `<h4>Patient:</h4><div>${this.data.id} ${this.data.name}</div><button >Save</button>`;
        document.body.append(node)
    }
}