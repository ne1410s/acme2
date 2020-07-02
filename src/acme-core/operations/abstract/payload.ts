import * as Text from '@ne1410s/text';
import * as Crypto from '@ne1410s/crypto';
import { Ctor } from '@ne1410s/codl';
import { JsonOperation, ValidationError } from '@ne1410s/http';
import { IToken } from '../../web-models/token/base';

export abstract class PayloadOperation<
  TRequest extends IToken,
  TResponse extends IToken,
  TPayload
> extends JsonOperation<TRequest, TResponse> {
  constructor(
    protected baseUrl: string,
    relativePath: string,
    requestType: Ctor<TRequest>,
    responseType: Ctor<TResponse>
  ) {
    super(`${baseUrl}${relativePath}`, 'post', null, requestType, responseType);

    this.headers.set('content-type', 'application/jose+json');
  }

  async serialise(requestData: TRequest): Promise<string> {
    // Encode payload content
    const payloadRaw = await this.toPayload(requestData);
    const encodedPayload = Text.objectToBase64Url(payloadRaw);

    // Encode protected content
    const protectedRaw = this.getProtectedData(requestData);
    const protectedRawExtra = this.getExtraProtectedData(requestData);
    const protectedMerged = { ...protectedRaw, ...protectedRawExtra };
    const encodedProtect = Text.objectToBase64Url(protectedMerged);

    // Sign the encoded content
    const secret = this.getSecret(requestData);
    const signable = `${encodedProtect}.${encodedPayload}`;
    const signature = await Crypto.sign(signable, secret);

    return JSON.stringify({
      payload: encodedPayload,
      protected: encodedProtect,
      signature: signature,
    });
  }

  validateResponse(responseData: IToken): void {
    const messages: string[] = [];
    responseData = responseData || ({} as IToken);

    if (!responseData.token) {
      messages.push('Token is expected');
    }

    if (messages.length !== 0) {
      throw new ValidationError('The response is invalid', responseData, messages);
    }
  }

  /**
   * Enables a different model to be exposed to the caller besides that which
   * gets sent as payload. This is called as part serialisation; after
   * validation has taken place.
   * @param requestData The request data.
   */
  protected abstract async toPayload(requestData: TRequest): Promise<TPayload>;

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

  private getProtectedData(requestData: TRequest): any {
    return {
      alg: 'RS256',
      nonce: requestData.token,
      url: this.url,
    };
  }
}
