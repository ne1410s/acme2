import { Validation } from '@ne1410s/codl';

export class Challenge {
  challengeId: string;
  orderId: number;
  authCode: string;
  keyAuth: string;
}

export class ChallengeDetail extends Challenge {
  type: string;
  status: string;
  title: string;
  content: string;
}

export class DomainClaim {
  status: string;
  expires: Date;
  domain: string;
  wildcard: boolean;
  challenges: Array<ChallengeDetail>;
}

export class SubmitChallengeRequest extends Challenge {
  @Validation.required
  @Validation.min(0)
  authenticUserId: number;
}

export class SubmitChallengeResponse {
  outcome: string;
}
