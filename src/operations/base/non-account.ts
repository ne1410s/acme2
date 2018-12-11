import Crypto from "@ne1410s/crypto";
import { PayloadOperation } from "./payload";
import { IKeyPair_Jwk } from "@ne1410s/crypto/dist/interfaces";

export abstract class NonAccountOperation<TRequest, TResponse> extends PayloadOperation<TRequest, TResponse> {

    private keys: IKeyPair_Jwk;

    protected async getExtraProtectedData(requestData: TRequest): Promise<any> {

        this.keys = await Crypto.gen();

        return {
            jwk: this.keys.publicJwk
        };
    }

    protected getSecret(requestData: TRequest): JsonWebKey {
        
        if (!this.keys) {
            throw new Error('Keys have not been generated');
        }

        return this.keys.privateJwk;
    }
}