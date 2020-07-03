import { JsonOperation, HttpResponseError } from '@ne1410s/http';
import { GetCertRequest, GetCertResponse } from '../../web-models/order/get-cert';

export class GetCertOperation extends JsonOperation<GetCertRequest, GetCertResponse> {
  constructor(private baseUrl: string) {
    super(`${baseUrl}/cert/{certCode}`, 'get', null, GetCertRequest, GetCertResponse);
  }

  validateRequest(requestData: GetCertRequest): void {
    super.validateRequest(requestData);
    // Once deemed valid; correct the operation url at invocation time
    this._url = `${this.baseUrl}/cert/${requestData.certCode}`;

    this.headers.delete('accept');
    if (requestData.contentType) {
      this.headers.set('accept', requestData.contentType);
    }
  }

  async deserialise(response: Response, requestData: GetCertRequest): Promise<GetCertResponse> {
    if (!response.ok) {
      throw new HttpResponseError(response, this.verb);
    }

    return {
      contentType: response.headers.get('content-type'),
      content: await response.text(),
    };
  }
}
