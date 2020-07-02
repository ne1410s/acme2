import { ValidationError, HttpResponseError } from '@ne1410s/http';
import { AccountOperation } from '../abstract/account';
import { AccountRequest, AccountResponse } from '../../web-models/account/base';

export class GetAccountOperation extends AccountOperation<AccountRequest, AccountResponse, any> {
  constructor(baseUrl: string) {
    super(baseUrl, '/acct/{id}', AccountRequest, AccountResponse);
  }

  validateRequest(requestData: AccountRequest): void {
    super.validateRequest(requestData);
    // Once deemed valid; correct the operation url at invocation time
    this._url = this.getAccountUrl(requestData);
  }

  protected async toPayload(requestData: AccountRequest): Promise<any> {
    return {};
  }

  async deserialise(response: Response, requestData: AccountRequest): Promise<AccountResponse> {
    const responseText = await response.text(),
      retVal = {} as AccountResponse;

    if (response.ok) {
      const json = JSON.parse(responseText);
      retVal.status = json.status;
      retVal.created = new Date(json.createdAt);
      retVal.initialIp = json.initialIp;
      retVal.link = response.headers.get('link');
      retVal.accountUrl = this._url;
      retVal.token = response.headers.get('replay-nonce');
      retVal.contacts = json.contact;
    } else if (response.status === 403 && responseText.indexOf('deactivated') !== -1) {
      retVal.status = 'deactivated';
      retVal.accountUrl = this._url;
      retVal.token = response.headers.get('replay-nonce');
    } else {
      throw new HttpResponseError(response, this.verb);
    }

    return retVal;
  }

  validateResponse(responseData: AccountResponse): void {
    super.validateResponse(responseData);

    const messages: string[] = [];

    if (!responseData.status) {
      messages.push('Status is expected');
    }

    if (messages.length !== 0) {
      throw new ValidationError('The response is invalid', responseData, messages);
    }
  }
}
