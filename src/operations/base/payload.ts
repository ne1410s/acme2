import Text from "@ne1410s/text";
import Crypto from "@ne1410s/crypto";
import { JsonOperation } from "@ne1410s/http";
import { IToken } from "../../interface";

export abstract class PayloadOperation<TRequest extends IToken, TResponse extends IToken> extends JsonOperation<TRequest, TResponse> {

    constructor (protected baseUrl: string, relativePath: string) {

        super(`${baseUrl}${relativePath}`, 'post');

        this.headers.set('content-type', 'application/jose+json');
    }

    /**
     * Enables a different model to be exposed to the caller besides that which
     * gets dispatched. This is called as part serialisation; after validation
     * has taken place. (By default, the caller model is dispatched).
     * @param requestData The request data.
     */
    mapValidRequest(requestData: TRequest): any {
        return requestData;
    }

    serialise(requestData: TRequest): string {

        // Encode payload content
        const mappedRequest = this.mapValidRequest(requestData);
        const encodedPayload = Text.objectToBase64Url(mappedRequest);

        // Encode protected content
        const protectedRaw = this.getProtectedData(requestData);
        const protectedRawExtra = this.getExtraProtectedData(requestData);
        const protectedMerged = { ...protectedRaw, ...protectedRawExtra };
        const encodedProtect = Text.objectToBase64Url(protectedMerged);

        // Sign the encoded content
        const secret = this.getSecret(requestData);
        const signable = `${encodedProtect}.${encodedPayload}`;
        const signature = Crypto.sign(signable, secret);

        console.log('payl', mappedRequest, '->', encodedPayload);
        console.log('prot', protectedMerged, '->', encodedProtect);
        console.log('sig', signature);

        return JSON.stringify({
            payload: encodedPayload,
            protected: encodedProtect,
            signature: signature
        });
    }

    protected getProtectedData(requestData: TRequest): any {

        return {
            alg: 'RS256',
            nonce: requestData.token,
            url: this.url
        };
    }

    /**
     * Additional properties of the protected header vary according to context.
     * @param requestData The request data.
     */
    protected abstract getExtraProtectedData(requestData: TRequest): any;

    /**
     * Secret may be obtained from the request else is generated.
     * @param requestData The request data.
     */
    protected abstract getSecret(requestData: TRequest): JsonWebKey;
}