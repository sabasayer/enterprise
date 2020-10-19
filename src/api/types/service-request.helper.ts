import { ServiceRequest } from "./service-request.interface";

export type ExtractRequest<A> = A extends ServiceRequest<infer TRequest, any>
    ? TRequest
    : undefined;
export type ExtractResult<A> = A extends ServiceRequest<any, infer TResult>
    ? TResult
    : undefined;

//examples

type TestServiceRequest = ServiceRequest<number, boolean>;

const data: TestServiceRequest = {
    name: "asd",
};

type GetRequest = ExtractRequest<TestServiceRequest>;
type GetResult = ExtractResult<TestServiceRequest>;
