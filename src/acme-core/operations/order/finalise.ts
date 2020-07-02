import * as Crypto from '@ne1410s/crypto';
import { ValidationError, HttpResponseError } from '@ne1410s/http';
import { AccountOperation } from '../abstract/account';
import {
  FinaliseOrderRequest,
  FinaliseOrderResponse,
  FinaliseOrderPayload,
} from '../../web-models/order/finalise';

export class FinaliseOrderOperation extends AccountOperation<
  FinaliseOrderRequest,
  FinaliseOrderResponse,
  FinaliseOrderPayload
> {
  constructor(baseUrl: string) {
    super(baseUrl, '/finalize/{accountId}/{orderId}', FinaliseOrderRequest, FinaliseOrderResponse);
  }

  validateRequest(requestData: FinaliseOrderRequest): void {
    super.validateRequest(requestData);
    const messages: string[] = [];
    if (requestData.originalCsr != null) {
      messages.push('Original csr must not be supplied manually');
    }

    if (messages.length !== 0) {
      throw new ValidationError('The request is invalid', requestData, messages);
    }

    // Once deemed valid; correct the operation url at invocation time
    this._url = `${this.baseUrl}/finalize/${requestData.accountId}/${requestData.orderId}`;
  }

  protected async toPayload(requestData: FinaliseOrderRequest): Promise<FinaliseOrderPayload> {
    const domains = requestData.identifiers.map((i) => i.value),
      company = requestData.company,
      department = requestData.department;

    requestData.originalCsr = await Crypto.csr({ domains, company, department });

    return {
      csr: requestData.originalCsr.der,
    };
  }

  async deserialise(
    response: Response,
    requestData: FinaliseOrderRequest
  ): Promise<FinaliseOrderResponse> {
    if (!response.ok) {
      throw new HttpResponseError(response, this.verb);
    }

    const json = await response.json();

    return {
      status: json.status,
      expires: json.expires,
      certificateUrl: json.certificate,
      originalCsr: requestData.originalCsr,
      token: response.headers.get('replay-nonce'),
    };
  }
}
