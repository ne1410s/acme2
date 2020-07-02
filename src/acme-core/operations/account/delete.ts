import { AccountOperation } from '../abstract/account';
import { AccountRequest } from '../../web-models/account/base';
import { HttpResponseError, ValidationError } from '@ne1410s/http';
import { DeleteAccountResponse } from '../../web-models/account/delete';
import { SubmitChallengeOperation } from '../../../express-api/operations/challenge/submit';

export class DeleteAccountOperation extends AccountOperation<
  AccountRequest,
  DeleteAccountResponse,
  any
> {
  constructor(baseUrl: string) {
    super(baseUrl, '/acct/{id}', AccountRequest, DeleteAccountResponse);
  }

  validateRequest(requestData: AccountRequest): void {
    super.validateRequest(requestData);
    // Once deemed valid; correct the operation url at invocation time
    this._url = this.getAccountUrl(requestData);
  }

  protected async toPayload(requestData: AccountRequest): Promise<any> {
    return {
      status: 'deactivated',
    };
  }

  async deserialise(
    response: Response,
    requestData: AccountRequest
  ): Promise<DeleteAccountResponse> {
    if (!response.ok) {
      throw new HttpResponseError(response, this.verb);
    }

    const json = await response.json();

    return {
      status: json.status,
      token: response.headers.get('replay-nonce'),
    };
  }
}
