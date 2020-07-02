import { Validation } from '@ne1410s/codl';

export class AuthEntryRequest {
  @Validation.required
  @Validation.minLength(6)
  username: string;

  @Validation.required
  @Validation.minLength(6)
  password: string;
}

export class CaptchaRequest extends AuthEntryRequest {
  @Validation.required
  recaptcha: string;
}

export class AuthEntryResponse {
  @Validation.required
  token: string;

  @Validation.required
  @Validation.min(0)
  lifetime: number;
}

export class HashResult {
  @Validation.required
  hash: string;

  @Validation.required
  salt: string;
}

export class SecureRequest {
  @Validation.required
  @Validation.min(0)
  authenticUserId: number;
}
