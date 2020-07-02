import * as Crypto from '@ne1410s/crypto';
import { Ctor } from '@ne1410s/codl';
import { ValidationError } from '@ne1410s/http';
import { PayloadOperation } from './payload';
import { IToken } from '../../web-models/token/base';

export abstract class NonAccountOperation<
  TRequest extends IToken,
  TResponse extends IToken,
  TPayload
> extends PayloadOperation<TRequest, TResponse, TPayload> {
  protected keys: Crypto.IKeyPair_Jwk;

  constructor(
    baseUrl: string,
    relativePath: string,
    requestType: Ctor<TRequest>,
    responseType: Ctor<TResponse>
  ) {
    super(baseUrl, relativePath, requestType, responseType);
  }

  async invoke(requestData: TRequest): Promise<TResponse> {
    this.keys = await Crypto.gen();

    return await super.invoke(requestData);
  }

  validateRequest(requestData: TRequest): void {
    super.validateRequest(requestData);

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
      jwk: this.keys.publicJwk,
    };
  }

  protected getSecret(requestData: TRequest): JsonWebKey {
    return this.keys.privateJwk;
  }
}
