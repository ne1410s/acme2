import { ValidationError, HttpResponseError } from "@ne1410s/http";
import { NonAccountOperation } from "../abstract/non-account";
import { ICreateAccountRequest, ICreateAccountResponse, ICreateAccountPayload } from "../../interfaces/account/create";

export class CreateAccountOperation extends NonAccountOperation<ICreateAccountRequest, ICreateAccountResponse, ICreateAccountPayload> {
    
    constructor (baseUrl: string) {
        
        super(baseUrl, '/new-acct');
    }

    validateRequest(requestData: ICreateAccountRequest): void {
        
        super.validateRequest(requestData);

        const messages: string[] = [];

        if (requestData.emails.length == 0) {
            messages.push('At least one email is required');
        }

        requestData.emails.forEach(email => {
            if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
                messages.push('Email is invalid: ' + email);
            }
        });

        if (!requestData.termsAgreed) {
            messages.push('Terms agreement is required');
        }

        if (messages.length !== 0) {
            throw new ValidationError('The request is invalid', requestData, messages);
        }
    }

    protected async toPayload(requestData: ICreateAccountRequest): Promise<ICreateAccountPayload> {
        return {
            contact: requestData.emails.map(r => `mailto:${r}`),
            onlyReturnExisting: false,
            termsOfServiceAgreed: requestData.termsAgreed
        };
    }

    async deserialise(response: Response, requestData: ICreateAccountRequest): Promise<ICreateAccountResponse> {
  
        if (!response.ok) {
            throw new HttpResponseError(response, this.verb);
        }
        
        const json = await response.json(),
              location = response.headers.get('location') || '',
              locParts = location.split('/');

        return {
            accountId: parseInt(locParts[locParts.length - 1], 10),
            status: json.status,
            created: new Date(json.createdAt),
            initialIp: json.initialIp,
            link: response.headers.get('link'),
            accountUrl: location,
            token: response.headers.get('replay-nonce'),
            contacts: json.contact,
            keys: this.keys
        };
    }
    
    validateResponse(responseData: ICreateAccountResponse): void {
        
        super.validateResponse(responseData);

        const messages: string[] = [];

        if (!responseData.accountId) {
            messages.push('Id is expected');
        }

        if (!responseData.keys) {
            messages.push('Keys are expected');
        }

        if (messages.length !== 0) {
            throw new ValidationError('The response is invalid', responseData, messages);
        }
    }
}