import { Validation } from '@ne1410s/codl';

export class Challenge {
  @Validation.required
  status: string;
  @Validation.required
  token: string;
  type: string;
  url: string;
}

export class FulfilmentData {
  implemented: boolean;

  @Validation.required
  keyAuth: string;

  @Validation.required
  title: string;

  @Validation.required
  content: string;
  more: any;
}

export class ChallengeDetail extends Challenge {
  @Validation.required
  challengeId: string;
  @Validation.required
  authCode: string;
  @Validation.required
  fulfilmentData: FulfilmentData;
}
