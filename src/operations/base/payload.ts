import Text from "@ne1410s/text";
import Crypto from "@ne1410s/crypto";
import { JsonOperation } from "@ne1410s/http";
import { IToken } from "../../requests/account";

export abstract class PayloadOperation<TRequest extends IToken, TResponse extends IToken> extends JsonOperation<TRequest, TResponse> {

    constructor (url: string) {

        super(url, 'post');

        this.headers.set('content-type', 'application/jose+json');
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

        const protect = {
            ...this.getProtectedData(requestData),
            ...this.getExtraProtectedData(requestData)
        };

        const mappedRequest = this.mapValidRequest(requestData);
        const encodedPayload = Text.objectToBase64Url(mappedRequest);
        const encodedProtect = Text.objectToBase64Url(protect);

        const secret = this.getSecret(requestData);
        const signature = Crypto.sign(`${encodedProtect}.${encodedPayload}`, secret);

        return JSON.stringify({
            payload: encodedPayload,
            protected: encodedProtect,
            signature: signature
        });
    }

    protected async getProtectedData(requestData: TRequest): Promise<any> {

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