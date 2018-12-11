import { PayloadOperation } from "./payload";
import { IAccountRequest } from "../../requests/account";

export abstract class AccountOperation<TRequest extends IAccountRequest, TResponse> extends PayloadOperation<TRequest, TResponse> {
    
    protected async getExtraProtectedData(requestData: TRequest): Promise<any> {

        await Promise.resolve();
        
        return {
            kid: `${this.baseUrl}/acct/${requestData.accountId}`
        };
    }

    protected getSecret(requestData: TRequest): JsonWebKey {
        
        return requestData.secret;
    }
}