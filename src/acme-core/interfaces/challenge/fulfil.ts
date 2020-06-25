import { IAccountRequest } from '../account/base';
import { IResponse } from '../token/base';
import { IChallengeDetail, IChallenge } from './base';

export interface IFulfilChallengeRequest extends IAccountRequest {
  challengeDetail: IChallengeDetail;
}

export interface IFulfilChallengePayload {
  keyAuthorization: string;
}

export interface IFulfilChallengeResponse extends IChallenge, IResponse {}
