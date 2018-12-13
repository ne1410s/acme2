import { ValidationError, HttpResponseError } from "@ne1410s/http";
import { NonAccountOperation } from "./base/non-account";
import { ICreateAccountRequest, ICreateAccountResponse } from "../interfaces/create-account";

export class CreateAccountOperation extends NonAccountOperation<ICreateAccountRequest, ICreateAccountResponse> {
    
    constructor (baseUrl: string) {
        
        super(baseUrl, '/new-acct');
    }

    validateRequest(requestData: ICreateAccountRequest): void {
        
        super.validateRequest(requestData);

        const messages: string[] = [];

        if (requestData.emails.length == 0) {
            messages.push('At least one email is required');
        }

        if (!requestData.termsAgreed) {
            messages.push('Terms agreement is required');
        }

        if (messages.length !== 0) {
            throw new ValidationError('The request is invalid', requestData, messages);
        }
    }

    mapValidRequest(requestData: ICreateAccountRequest): any {
        return {
            contact: requestData.emails.map(r => `mailto:${r}`),
            onlyReturnExisting: false,
            termsOfServiceAgreed: requestData.termsAgreed
        };
    }

    async deserialise(response: Response, requestData: ICreateAccountRequest): Promise<ICreateAccountResponse> {
        
        const responseText = await response.text();

        if (!response.ok) {
            throw new HttpResponseError(response.status, response.statusText, response.headers, responseText);
        }      

        const json = JSON.parse(responseText);
        return {
            id: json.id,
            status: json.status,
            created: new Date(json.createdAt),
            initialIp: json.initialIp,
            link: response.headers.get('link'),
            url: response.headers.get('location'),
            token: response.headers.get('replay-nonce'),
            keys: this.keys
        };
    }
    
    validateResponse(responseData: ICreateAccountResponse): void {
        
        const messages: string[] = [];

        if (!responseData.id) {
            messages.push('Id is required');
        }

        if (!responseData.keys) {
            messages.push('Keys are required');
        }

        if (messages.length !== 0) {
            throw new ValidationError('The response is invalid', responseData, messages);
        }
    }
}