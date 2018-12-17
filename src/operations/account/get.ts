import { ValidationError, HttpResponseError } from "@ne1410s/http";
import { AccountOperation } from "../abstract/account";
import { IAccountRequest, IAccountResponse } from "../../interfaces/account/base";

export class GetAccountOperation extends AccountOperation<IAccountRequest, IAccountResponse, any> {

    constructor (baseUrl: string) {
        
        super(baseUrl, '/acct/{id}');
    }

    validateRequest(requestData: IAccountRequest): void {

        super.validateRequest(requestData);

        // Once deemed valid; correct the operation url at invocation time
        this._url = this.getAccountUrl(requestData);
    }

    protected async toPayload(requestData: IAccountRequest): Promise<any> {
        return {};
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
            accountUrl: this._url,
            token: response.headers.get('replay-nonce'),
            contacts: json.contact
        };
    }
    
    validateResponse(responseData: IAccountResponse): void {
        
        super.validateResponse(responseData);
        
        const messages: string[] = [];

        if (!responseData.status) {
            messages.push('Status is expected');
        }

        if (messages.length !== 0) {
            throw new ValidationError('The response is invalid', responseData, messages);
        }
    }
}