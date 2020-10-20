import { EnterpriseDataProvider } from "@sabasayer/enterprise";
import { getSimpleStringRequestOptions, GetSimpleString } from "./simple-request.api";

export class SimpleProvider extends EnterpriseDataProvider {
    getString(request: GetSimpleString) {
        return this.apiRequest(getSimpleStringRequestOptions, request)
    }
}