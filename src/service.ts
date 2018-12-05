import { ServiceResponse } from "./response";
import { ServiceRequest } from "./request";

abstract class OperationBase<TRequest extends ServiceRequest, TResponse extends ServiceResponse<TRequest>> {

    abstract async invoke(request: TRequest): Promise<TResponse>;
}

export default class Acme2Service {

}