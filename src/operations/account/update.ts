import { AccountOperation } from "../abstract/account";
import { IUpdateAccountRequest, IUpdateAccountPayload } from "../../interfaces/account/update";
import { IAccountResponse } from "../../interfaces/account/base";
import { HttpResponseError, ValidationError } from "@ne1410s/http";

export class UpdateAccountOperation extends AccountOperation<IUpdateAccountRequest, IAccountResponse, IUpdateAccountPayload> {

    constructor (baseUrl: string) {
        
        super(baseUrl, '/acct/{id}');
    }

    validateRequest(requestData: IUpdateAccountRequest): void {

        super.validateRequest(requestData);

        const messages: string[] = [];

        if (requestData.emails.length == 0) {
            messages.push('At least one email is required');
        }
        
        if (messages.length !== 0) {
            throw new ValidationError('The request is invalid', requestData, messages);
        }

        // Once deemed valid; correct the operation url at invocation time
        this._url = this.getAccountUrl(requestData);
    }

    protected toPayload(requestData: IUpdateAccountRequest): IUpdateAccountPayload {
        return {
            contact: requestData.emails.map(r => `mailto:${r}`)
        };
    }

    async deserialise(response: Response, requestData: IUpdateAccountRequest): Promise<IAccountResponse> {
        
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
            url: this._url,
            token: response.headers.get('replay-nonce'),
            contacts: json.contact
        };
    }
        
    validateResponse(responseData: IAccountResponse): void {
        
        super.validateResponse(responseData);
        
        const messages: string[] = [];

        if (!responseData.contacts || responseData.contacts.length == 0) {
            messages.push('Contacts are expected');
        }

        if (messages.length !== 0) {
            throw new ValidationError('The response is invalid', responseData, messages);
        }
    }
}