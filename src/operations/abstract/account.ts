import { ValidationError } from "@ne1410s/http";
import { PayloadOperation } from "./payload";
import { IResponse } from "../../interfaces/token/base";
import { IAccountRequest } from "../../interfaces/account/base";

export abstract class AccountOperation<TRequest extends IAccountRequest, TResponse extends IResponse, TPayload> extends PayloadOperation<TRequest, TResponse, TPayload> {
    
    validateRequest(requestData: IAccountRequest): void {
        
        const messages: string[] = [];
        requestData = requestData || {} as IAccountRequest;

        if (!requestData.accountId) {
            messages.push('Account id is required');
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
        return `${this.baseUrl}/acct/${requestData.accountId}`;
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