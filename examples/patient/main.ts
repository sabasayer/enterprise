import { EnterpriseApi } from "@sabasayer/enterprise"
import { PatientListComponent } from './patient-list-component';
import { PatientCollectionProvider } from "./patient-collection-provider";
import { PatientComponent } from "./patient-component";

const enterpriseApi = new EnterpriseApi({
    baseUrl: 'http://5c50441dee97f600140480bc.mockapi.io'
});

PatientCollectionProvider.initialize();

new PatientListComponent();
new PatientComponent("1");

export {
    enterpriseApi
}