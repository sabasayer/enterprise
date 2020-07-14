import { EnterpriseApi } from "@sabasayer/enterprise"
import { PatientListComponent } from './patient-list-component';
import { PatientCollectionProvider } from "./patient-collection-provider";
import { PatientComponent } from "./patient-component";
import { PatientCollectionLogic } from "./patient-collection-logic";

const enterpriseApi = new EnterpriseApi({
    baseUrl: 'http://5c50441dee97f600140480bc.mockapi.io'
});

PatientCollectionLogic.initialize(enterpriseApi);
new PatientComponent("1");
new PatientListComponent();

const res = PatientCollectionLogic.instance.provider.cancellableApiRequest({url:'patient'},{},'12')
res.token.cancel();


export {
    enterpriseApi
}