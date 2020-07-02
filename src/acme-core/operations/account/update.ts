import { AccountOperation } from '../abstract/account';
import { UpdateAccountRequest, UpdateAccountPayload } from '../../web-models/account/update';
import { AccountResponse } from '../../web-models/account/base';
import { HttpResponseError, ValidationError } from '@ne1410s/http';

export class UpdateAccountOperation extends AccountOperation<
  UpdateAccountRequest,
  AccountResponse,
  UpdateAccountPayload
> {
  constructor(baseUrl: string) {
    super(baseUrl, '/acct/{id}', UpdateAccountRequest, AccountResponse);
  }

  validateRequest(requestData: UpdateAccountRequest): void {
    super.validateRequest(requestData);
    // Once deemed valid; correct the operation url at invocation time
    this._url = this.getAccountUrl(requestData);
  }

  protected async toPayload(requestData: UpdateAccountRequest): Promise<UpdateAccountPayload> {
    return {
      contact: requestData.emails.map((r) => `mailto:${r}`),
    };
  }

  async deserialise(
    response: Response,
    requestData: UpdateAccountRequest
  ): Promise<AccountResponse> {
    if (!response.ok) {
      throw new HttpResponseError(response, this.verb);
    }

    const json = await response.json();

    return {
      status: json.status,
      created: json.createdAt,
      initialIp: json.initialIp,
      link: response.headers.get('link'),
      accountUrl: this._url,
      contacts: json.contact,
      token: response.headers.get('replay-nonce'),
    };
  }
}
