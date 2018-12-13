import Crypto from "@ne1410s/crypto";
import { IKeyPair_Jwk } from "@ne1410s/crypto/dist/interfaces";
import { ValidationError } from "@ne1410s/http";
import { PayloadOperation } from "./payload";
import { IRequest, IResponse } from "../../interfaces/token/base";

export abstract class NonAccountOperation<TRequest extends IRequest, TResponse extends IResponse, TPayload> extends PayloadOperation<TRequest, TResponse, TPayload> {

    protected keys: IKeyPair_Jwk;

    async invoke(requestData: TRequest): Promise<TResponse> {
        
        this.keys = await Crypto.gen();

        return await super.invoke(requestData);
    }

    validateRequest(requestData: TRequest): void {
        
        const messages: string[] = [];

        if (!this.keys || !this.keys.privateJwk || !this.keys.publicJwk) {
            messages.push('Keys have not been generated correctly');
        }

        if (messages.length !== 0) {
            throw new ValidationError('The request is invalid', this.keys, messages);
        }
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