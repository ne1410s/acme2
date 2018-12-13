import { PayloadOperation } from "./payload";
import { IAccountRequest, IToken } from "../../interfaces/base";

export abstract class AccountOperation<TRequest extends IAccountRequest, TResponse extends IToken> extends PayloadOperation<TRequest, TResponse> {
    
    protected getExtraProtectedData(requestData: TRequest): any {

        return {
            kid: `${this.baseUrl}/acct/${requestData.id}`
        };
    }

    protected getSecret(requestData: TRequest): JsonWebKey {
        
        return requestData.keys.privateJwk;
    }
}