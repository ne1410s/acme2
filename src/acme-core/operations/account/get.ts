import { ValidationError, HttpResponseError } from '@ne1410s/http';
import { AccountOperation } from '../abstract/account';
import { IAccountRequest, IAccountResponse } from '../../interfaces/account/base';

export class GetAccountOperation extends AccountOperation<IAccountRequest, IAccountResponse, any> {
  constructor(baseUrl: string) {
    super(baseUrl, '/acct/{id}');
  }

  validateRequest(requestData: IAccountRequest): void {
    super.validateRequest(requestData);

    // Once deemed valid; correct the operation url at invocation time
    this._url = this.getAccountUrl(requestData);
  }

  protected async toPayload(requestData: IAccountRequest): Promise<any> {
    return {};
  }

  async deserialise(response: Response, requestData: IAccountRequest): Promise<IAccountResponse> {
    const responseText = await response.text(),
      retVal = {} as IAccountResponse;

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

  validateResponse(responseData: IAccountResponse): void {
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
