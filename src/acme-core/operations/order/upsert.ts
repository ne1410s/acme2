import { ValidationError, HttpResponseError } from '@ne1410s/http';
import { AccountOperation } from '../abstract/account';
import { UpsertOrderRequest, UpsertOrderPayload } from '../../web-models/order/upsert';
import { ActiveOrderResponse } from '../../web-models/order/base';

export class UpsertOrderOperation extends AccountOperation<
  UpsertOrderRequest,
  ActiveOrderResponse,
  UpsertOrderPayload
> {
  constructor(baseUrl: string) {
    super(baseUrl, '/new-order', UpsertOrderRequest, ActiveOrderResponse);
  }

  validateRequest(requestData: UpsertOrderRequest): void {
    super.validateRequest(requestData);

    const messages: string[] = [];

    if (requestData.startsOn || requestData.endsOn) {
      messages.push('Start and end dates are not currently implemented');
    }

    if (messages.length !== 0) {
      throw new ValidationError('The request is invalid', requestData, messages);
    }
  }

  protected async toPayload(requestData: UpsertOrderRequest): Promise<UpsertOrderPayload> {
    return {
      // TODO: Map start & end dates to iso strings
      identifiers: requestData.domains.map((domain: any) => ({
        type: 'dns',
        value: domain,
      })),
    };
  }

  async deserialise(
    response: Response,
    requestData: UpsertOrderRequest
  ): Promise<ActiveOrderResponse> {
    if (!response.ok) {
      throw new HttpResponseError(response, this.verb);
    }

    const json = await response.json(),
      location = response.headers.get('location') || '',
      locParts = location.split('/');

    return {
      orderId: parseInt(locParts[locParts.length - 1], 10),
      status: json.status,
      orderUrl: location,
      expires: json.expires,
      finaliseUrl: json.finalize,
      identifiers: json.identifiers,
      token: response.headers.get('replay-nonce'),
      authCodes: json.authorizations.map((authUrl: string) => {
        const authUrlParts = authUrl.split('/');
        return authUrlParts[authUrlParts.length - 1];
      }),
    };
  }
}
