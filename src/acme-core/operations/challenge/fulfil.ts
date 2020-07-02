import { HttpResponseError, ValidationError } from '@ne1410s/http';
import { AccountOperation } from '../abstract/account';
import {
  FulfilChallengePayload,
  FulfilChallengeResponse,
  FulfilChallengeRequest,
} from '../../web-models/challenge/fulfil';

export class FulfilChallengeOperation extends AccountOperation<
  FulfilChallengeRequest,
  FulfilChallengeResponse,
  FulfilChallengePayload
> {
  constructor(baseUrl: string) {
    super(baseUrl, '/chall-v3/{authCode}/{id}', FulfilChallengeRequest, FulfilChallengeResponse);
  }

  validateRequest(requestData: FulfilChallengeRequest): void {
    super.validateRequest(requestData);
    // once deemed valid; correct the operation url at invocation time
    this._url = `${this.baseUrl}/chall-v3/${requestData.challengeDetail.authCode}/${requestData.challengeDetail.challengeId}`;
  }

  protected async toPayload(requestData: FulfilChallengeRequest): Promise<FulfilChallengePayload> {
    return {
      keyAuthorization: requestData.challengeDetail.fulfilmentData.keyAuth,
    };
  }

  async deserialise(
    response: Response,
    requestData: FulfilChallengeRequest
  ): Promise<FulfilChallengeResponse> {
    if (!response.ok) {
      throw new HttpResponseError(response, this.verb);
    }

    const json = await response.json();

    return {
      status: json.status,
      type: json.type,
      url: json.url,
      token: response.headers.get('replay-nonce'),
    };
  }
}
