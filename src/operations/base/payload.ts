import Text from "@ne1410s/text";
import Crypto from "@ne1410s/crypto";
import { JsonOperation } from "@ne1410s/http";

import { TokenOperation } from "../token";

export abstract class PayloadOperation<TRequest, TResponse> extends JsonOperation<TRequest, TResponse> {

    private readonly tokenOperation: TokenOperation;

    get protectedData(): any {
        return {
            alg: 'RS256',
            nonce: this.tokenOperation.invoke(),
            url: this.url
        };
    }

    constructor (protected baseUrl: string, relPath: string) {

        super(`${baseUrl}${relPath}`, 'post');

        this.headers.set('content-type', 'application/jose+json');
        this.tokenOperation = new TokenOperation(`${baseUrl}/new-nonce`);
    }

    /**
     * Facilitates separate data structure from the generic request type.
     * By default, the request object is used as-is.
     * @param requestData The request data.
     */
    mapValidRequest(requestData: TRequest): any {
        return requestData;
    }

    serialise(requestData: TRequest): string {

        const mappedRequest = this.mapValidRequest(requestData);

        const encodedPayload = Text.objectToBase64Url(mappedRequest);        
        const encodedProtect = Text.objectToBase64Url({ 
            ...this.protectedData,
            ...this.getExtraProtectedData(mappedRequest)
        });

        const secret = this.getSecret(mappedRequest);
        const signature = Crypto.sign(`${encodedProtect}.${encodedPayload}`, secret);

        return JSON.stringify({
            payload: encodedPayload,
            protected: encodedProtect,
            signature: signature
        });
    }

    /**
     * Additional properties of the protected header vary according to context.
     * @param requestData The request data.
     */
    protected abstract async getExtraProtectedData(requestData: TRequest): Promise<any>;

    /**
     * Secret may be obtained from the request else is generated.
     * @param requestData The request data.
     */
    protected abstract getSecret(requestData: TRequest): JsonWebKey;
}