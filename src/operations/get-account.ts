import { AccountOperation } from "./base/account";
import { IAccountRequest, IAccountResponse } from "../interfaces/base";
import { ValidationError, HttpResponseError } from "@ne1410s/http";

export class GetAccountOperation extends AccountOperation<IAccountRequest, IAccountResponse> {

    constructor (baseUrl: string) {
        
        super(baseUrl, '/acct/{id}');
    }

    validateRequest(requestData: IAccountRequest): void {

        super.validateRequest(requestData);

        // Once deemed valid; correct the operation url at invocation time
        this.url = this.getAccountUrl(requestData);
    }

    mapValidRequest(requestData: IAccountRequest): any {
                
        // TODO ??

        return super.mapValidRequest(requestData);
    }

    async deserialise(response: Response, requestData: IAccountRequest): Promise<IAccountResponse> {
        
        const responseText = await response.text();

        if (!response.ok) {
            throw new HttpResponseError(response.status, response.statusText, response.headers, responseText);
        }      

        const json = JSON.parse(responseText);
        return {
            status: json.status,
            created: new Date(json.createdAt),
            initialIp: json.initialIp,
            link: response.headers.get('link'),
            url: response.headers.get('location'),
            token: response.headers.get('replay-nonce')
        };
    }
    
    validateResponse(responseData: IAccountResponse): void {
        
        const messages: string[] = [];

        // TODO!

        if (messages.length !== 0) {
            throw new ValidationError('The response is invalid', responseData, messages);
        }
    }
}