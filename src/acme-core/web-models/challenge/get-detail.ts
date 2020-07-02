import { Validation } from '@ne1410s/codl';
import { ListChallengesResponse } from './list';
import { ChallengeDetail } from './base';

export class GetChallengeDetailRequest {
  @Validation.required
  publicJwk: JsonWebKey;

  @Validation.required
  listResponse: ListChallengesResponse;
}

export class GetChallengeDetailResponse {
  domain: string;
  wildcard: boolean;
  expires: Date;

  @Validation.required
  @Validation.minLength(1)
  detail: Array<ChallengeDetail>;
}
