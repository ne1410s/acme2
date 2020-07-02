import { IKeyPair_Jwk } from '@ne1410s/crypto';
import { Validation } from '@ne1410s/codl';
import { AccountRequest } from '../account/base';
import { IToken } from '../token/base';
import { ChallengeDetail, Challenge } from './base';

export class FulfilChallengeRequest extends AccountRequest {
  @Validation.required
  accountId: number;

  @Validation.required
  keys: IKeyPair_Jwk;

  @Validation.required
  token: string;

  @Validation.required
  challengeDetail: ChallengeDetail;
}

export class FulfilChallengePayload {
  keyAuthorization: string;
}

export class FulfilChallengeResponse extends Challenge implements IToken {}
