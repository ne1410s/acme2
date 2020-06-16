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

        requestData.emails.forEach(email => {
            if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
                messages.push('Email is invalid:' + email);
            }
        });
        
        if (messages.length !== 0) {
            throw new ValidationError('The request is invalid', requestData, messages);
        }

        // Once deemed valid; correct the operation url at invocation time
        this._url = this.getAccountUrl(requestData);
    }

    protected async toPayload(requestData: IUpdateAccountRequest): Promise<IUpdateAccountPayload> {
        return {
            contact: requestData.emails.map(r => `mailto:${r}`)
        };
    }

    async deserialise(response: Response, requestData: IUpdateAccountRequest): Promise<IAccountResponse> {
        
        if (!response.ok) {
            throw new HttpResponseError(response, this.verb);
        }

        const json = await response.json();
        
        return {
            status: json.status,
            created: json.createdAt,
            initialIp: json.initialIp,
            link: response.headers.get('link'),
            accountUrl: this._url,
            contacts: json.contact,
            token: response.headers.get('replay-nonce'),
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