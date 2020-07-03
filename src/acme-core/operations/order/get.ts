import { JsonOperation, HttpResponseError } from '@ne1410s/http';
import { OrderRequest, OrderResponse } from '../../web-models/order/base';

export class GetOrderOperation extends JsonOperation<OrderRequest, OrderResponse> {
  constructor(private baseUrl: string) {
    super(`${baseUrl}/order/{accountId}/{orderId}`, 'get', null, OrderRequest, OrderResponse);
  }

  validateRequest(requestData: OrderRequest): void {
    super.validateRequest(requestData);
    // once deemed valid; correct the operation url at invocation time
    this._url = `${this.baseUrl}/order/${requestData.accountId}/${requestData.orderId}`;
  }

  async deserialise(response: Response, requestData: OrderRequest): Promise<OrderResponse> {
    if (!response.ok) {
      throw new HttpResponseError(response, this.verb);
    }

    const json = await response.json();

    return {
      orderId: requestData.orderId,
      status: json.status,
      orderUrl: this._url,
      certificateUrl: json.certificate, // (once finalised)
      expires: json.expires,
      finaliseUrl: json.finalize,
      identifiers: json.identifiers,
      authCodes: json.authorizations.map((authUrl: string) => {
        const authUrlParts = authUrl.split('/');
        return authUrlParts[authUrlParts.length - 1];
      }),
    };
  }
}
