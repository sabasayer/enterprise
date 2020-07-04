import { patientCollectionProvider } from "./patient-collection-provider";
import { Patient } from "./patient";

export class PatientListComponent {
    data: Patient[] = [];

    constructor() {
        //get data
    }

    async getData() {
        const result = await patientCollectionProvider.get({
            search: "test",
        });

        if (result.error) {
            console.log(result);
            return;
        }

        this.data = result.data;
    }

    render() {}
}
