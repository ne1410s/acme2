import { IKeyPair_Jwk } from '@ne1410s/crypto';
import { AccountRequest } from './base';
import { Validation } from '@ne1410s/codl';

export class UpdateAccountRequest extends AccountRequest {
  @Validation.required
  accountId: number;

  @Validation.required
  keys: IKeyPair_Jwk;

  @Validation.required
  token: string;

  @Validation.required
  @Validation.minLength(1)
  @Validation.regex(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)
  emails: Array<string>;
}

export class UpdateAccountPayload {
  contact: Array<string>;
}
