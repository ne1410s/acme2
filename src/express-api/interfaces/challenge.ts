import { ISecureRequest } from './auth';

export interface IChallenge {
  challengeId: string;
  orderId: number;
  authCode: string;
  keyAuth: string;
}

export interface IChallengeDetail extends IChallenge {
  type: string;
  status: string;
  title: string;
  content: string;
}

export interface IDomainClaim {
  status: string;
  expires: Date;
  domain: string;
  wildcard: boolean;
  challenges: Array<IChallengeDetail>;
}

export interface ISubmitChallengeRequest extends IChallenge, ISecureRequest {}

export interface ISubmitChallengeResponse {
  outcome: string;
}
