import { HttpResponseError } from '@ne1410s/http';
import { NonAccountOperation } from '../abstract/non-account';
import {
  CreateAccountRequest,
  CreateAccountResponse,
  CreateAccountPayload,
} from '../../web-models/account/create';

export class CreateAccountOperation extends NonAccountOperation<
  CreateAccountRequest,
  CreateAccountResponse,
  CreateAccountPayload
> {
  constructor(baseUrl: string) {
    super(baseUrl, '/new-acct', CreateAccountRequest, CreateAccountResponse);
  }

  protected async toPayload(requestData: CreateAccountRequest): Promise<CreateAccountPayload> {
    return {
      contact: requestData.emails.map((r) => `mailto:${r}`),
      onlyReturnExisting: false,
      termsOfServiceAgreed: requestData.termsAgreed,
    };
  }

  async deserialise(
    response: Response,
    requestData: CreateAccountRequest
  ): Promise<CreateAccountResponse> {
    if (!response.ok) {
      throw new HttpResponseError(response, this.verb);
    }

    const json = await response.json(),
      location = response.headers.get('location') || '',
      locParts = location.split('/');

    return {
      accountId: parseInt(locParts[locParts.length - 1], 10),
      status: json.status,
      created: new Date(json.createdAt),
      initialIp: json.initialIp,
      link: response.headers.get('link'),
      accountUrl: location,
      token: response.headers.get('replay-nonce'),
      contacts: json.contact,
      keys: this.keys,
    };
  }
}
