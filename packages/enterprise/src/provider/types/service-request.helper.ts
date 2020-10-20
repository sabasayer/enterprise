import { ServiceRequest } from "../../api";

export type ExtractRequest<A> = A extends ServiceRequest<infer TRequest, any>
    ? TRequest
    : undefined;
export type ExtractResult<A> = A extends ServiceRequest<any, infer TResult>
    ? TResult
    : undefined;
