import { EnterpriseApi } from "@sabasayer/enterprise"
import { PatientListComponent } from './patient-list-component';

const api = new EnterpriseApi({
    baseUrl: 'http://5c50441dee97f600140480bc.mockapi.io'
});

new PatientListComponent();

export {
    api
}