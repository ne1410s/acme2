import { DomainIdentfier } from '../order/upsert';
import { Validation } from '@ne1410s/codl';
import { Challenge } from './base';

export class ListChallengesRequest {
  @Validation.required
  authCode: string;
}

export class ListChallengesResponse {
  @Validation.required
  @Validation.minLength(1)
  challenges: Array<Challenge>;

  @Validation.required
  expires: Date;

  @Validation.required
  identifier: DomainIdentfier;
  status: string;
  wildcard: boolean;
  authCode: string;
}
