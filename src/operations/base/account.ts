import { ValidationError } from "@ne1410s/http";
import { PayloadOperation } from "./payload";
import { IAccountRequest, IResponse } from "../../interfaces/base";

export abstract class AccountOperation<TRequest extends IAccountRequest, TResponse extends IResponse, TPayload> extends PayloadOperation<TRequest, TResponse, TPayload> {
    
    validateRequest(requestData: IAccountRequest): void {
        
        const messages: string[] = [];

        if (!requestData || !requestData.id) {
            messages.push('Id is required');
        }

        if (!requestData.keys || !requestData.keys.privateJwk) {
            messages.push('Private key is required');
        }

        if (!requestData.token) {
            messages.push('Token is required');
        }

        if (messages.length !== 0) {
            throw new ValidationError('The request is invalid', requestData, messages);
        }
    }

    protected getAccountUrl(requestData: TRequest): string {
        return `${this.baseUrl}/acct/${requestData.id}`;
    }

    protected getExtraProtectedData(requestData: TRequest): any {

        return {
            kid: this.getAccountUrl(requestData)
        };
    }

    protected getSecret(requestData: TRequest): JsonWebKey {
        
        return requestData.keys.privateJwk;
    }
}