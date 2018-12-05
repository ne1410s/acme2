import { ServiceRequest, JsonRequest } from "./request";

export abstract class ServiceResponse<TRequest extends ServiceRequest> {

    public static async create<TRequest extends ServiceRequest, TResponse extends ServiceResponse<TRequest>>(
            request: TRequest,
            rawResponse: Response,
            type: { new(): TResponse }): Promise<TResponse> {

        const retVal = new type();

        retVal.request = request;
        retVal.rawContent = await rawResponse.text();
        retVal.head = {};
        rawResponse.headers.forEach((k, v) => retVal.head[k] = v);

        return retVal;
    }

    request: TRequest;
    head: any;
    rawContent: string; 
}

export abstract class JsonResponse<TRequest extends JsonRequest<TRequestBody>, TRequestBody, TResponseBody, TResponseFoot> extends ServiceResponse<TRequest> {

    get body(): TResponseBody {

        return JSON.parse(this.rawContent);
    }

    abstract get foot(): TResponseFoot;
}
