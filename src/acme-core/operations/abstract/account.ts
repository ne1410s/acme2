import { PayloadOperation } from './payload';
import { IToken } from '../../web-models/token/base';
import { AccountRequest } from '../../web-models/account/base';

export abstract class AccountOperation<
  TRequest extends AccountRequest,
  TResponse extends IToken,
  TPayload
> extends PayloadOperation<TRequest, TResponse, TPayload> {
  protected getAccountUrl(requestData: TRequest): string {
    return `${this.baseUrl}/acct/${requestData.accountId}`;
  }

  protected getExtraProtectedData(requestData: TRequest): any {
    return {
      kid: this.getAccountUrl(requestData),
    };
  }

  protected getSecret(requestData: TRequest): JsonWebKey {
    return requestData.keys.privateJwk;
  }
}
