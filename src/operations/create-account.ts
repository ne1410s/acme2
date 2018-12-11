import { NonAccountOperation } from "./base/non-account";
import { ICreateAccountRequest, ICreateAccountResponse } from "../requests/account";
import { ValidationError } from "@ne1410s/http";

export class CreateAccountOperation extends NonAccountOperation<ICreateAccountRequest, ICreateAccountResponse> {
    
    constructor (baseUrl: string) {
        
        super(`${baseUrl}/new-acct`);
    }

    validateRequest(requestData: ICreateAccountRequest): void {
        
        const messages: string[] = [];

        if (requestData.emails.length == 0) {
            messages.push('At least one email is required');
        }

        if (!requestData.termsAgreed) {
            messages.push('Terms agreement is required');
        }

        if (messages.length !== 0) {
            throw new ValidationError(requestData, messages);
        }
    }

    mapValidRequest(requestData: ICreateAccountRequest): any {
        return {
            contact: requestData.emails.map(r => `mailto:${r}`),
            onlyReturnExisting: false,
            termsOfServiceAgreed: requestData.termsAgreed
        };
    }

    async deserialise(response: Response): Promise<ICreateAccountResponse> {
        
        const raw = await response.json();

        return {
            id: raw.id,
            status: raw.status,
            created: new Date(raw.createdAt),
            initialIp: raw.initialIp,
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
            throw new ValidationError(responseData, messages);
        }
    }
}