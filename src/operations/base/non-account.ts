import Crypto from "@ne1410s/crypto";
import { PayloadOperation } from "./payload";
import { IKeyPair_Jwk } from "@ne1410s/crypto/dist/interfaces";
import { IToken } from "../../requests/account";

export abstract class NonAccountOperation<TRequest extends IToken, TResponse extends IToken> extends PayloadOperation<TRequest, TResponse> {

    protected keys: IKeyPair_Jwk;

    async invoke(requestData: TRequest): Promise<TResponse> {
        
        this.keys = await Crypto.gen();

        return await super.invoke(requestData);
    }

    protected getExtraProtectedData(requestData: TRequest): any {

        return {
            jwk: this.keys.publicJwk
        };
    }

    protected getSecret(requestData: TRequest): JsonWebKey {
        
        return this.keys.privateJwk;
    }
}