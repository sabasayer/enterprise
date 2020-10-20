import { EnterpriseCollectionProvider } from "./enterprise-collection-provider";

export type ExtractGetRequest<A> = A extends EnterpriseCollectionProvider<
    any,
    infer TGetRequest,
    any,
    any,
    any,
    any
>
    ? TGetRequest
    : undefined;

export type ExtractSaveRequest<A> = A extends EnterpriseCollectionProvider<
    any,
    any,
    infer TSaveRequest,
    any,
    any,
    any
>
    ? TSaveRequest
    : undefined;

export type ExtractSaveResponse<A> = A extends EnterpriseCollectionProvider<
    any,
    any,
    any,
    any,
    infer TSaveResponse,
    any
>
    ? TSaveResponse 
    : undefined;

export type ExtractDeleteRequest<A> = A extends EnterpriseCollectionProvider<
    any,
    any,
    any,
    infer TDeleteRequest,
    any,
    any
>
    ? TDeleteRequest
    : undefined;

export type ExtractDeleteResponse<A> = A extends EnterpriseCollectionProvider<
    any,
    any,
    any,
    any,
    any,
    infer TDeleteResponse
>
    ? TDeleteResponse
    : undefined;
