import { EnterpriseCollectionProvider } from "@sabasayer/enterprise";
import { Patient } from "./patient";
import { EnumCacheType } from "@sabasayer/utils";
import { EnumProvideFromCacheStrategy } from "@sabasayer/enterprise";
import {
  GetPatientRequest,
  getPatientRequestOptions,
  savePatientsRequestOptions,
  deletePatientsRequestOptions,
  SavePatientsRequest,
} from "./patient.api";
import { IEnterpriseApi } from "@sabasayer/enterprise";

export class PatientCollectionProvider extends EnterpriseCollectionProvider<
  Patient,
  GetPatientRequest,
  SavePatientsRequest
> {
  constructor(api: IEnterpriseApi) {
    super(api, {
      typename: "patient",
      cacheStrategy: EnumCacheType.Memory,
      idField: "id",
      provideFromCacheStrategy: EnumProvideFromCacheStrategy.CollectionId,
      getRequestOptions: getPatientRequestOptions,
      saveRequestOptions: savePatientsRequestOptions,
      deleteRequestOptions: deletePatientsRequestOptions,
    });
  }
}
