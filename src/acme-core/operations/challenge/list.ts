import { HttpResponseError, JsonOperation, ValidationError } from '@ne1410s/http';
import { ListChallengesRequest, ListChallengesResponse } from '../../web-models/challenge/list';

export class ListChallengesOperation extends JsonOperation<
  ListChallengesRequest,
  ListChallengesResponse
> {
  constructor(private baseUrl: string) {
    super(`${baseUrl}/authz-v3/{authCode}`, 'get');
  }

  validateRequest(requestData: ListChallengesRequest): void {
    super.validateRequest(requestData);
    // once deemed valid; correct the operation url at invocation time
    this._url = `${this.baseUrl}/authz-v3/${requestData.authCode}`;
  }

  async deserialise(
    response: Response,
    requestData: ListChallengesRequest
  ): Promise<ListChallengesResponse> {
    if (!response.ok) {
      throw new HttpResponseError(response, this.verb);
    }

    const json = await response.json();

    return {
      challenges: json.challenges,
      expires: json.expires,
      identifier: json.identifier,
      status: json.status,
      wildcard: !!json.wildcard,
      authCode: requestData.authCode,
    };
  }
}
