import { PatientListComponent } from './patient-list-component';
import { PatientCollectionProvider } from "./patient-collection-provider";
import { PatientComponent } from "./patient-component";
import { PatientCollectionLogic } from "./patient-collection-logic";
import { EnterpriseApi } from '../../src/api';

const enterpriseApi = new EnterpriseApi({
    baseUrl: 'http://5c50441dee97f600140480bc.mockapi.io'
});

PatientCollectionLogic.initialize(enterpriseApi);
new PatientComponent("1");
new PatientListComponent();

export {
    enterpriseApi
}