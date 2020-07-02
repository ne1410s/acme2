import { IKeyPair_Jwk } from '@ne1410s/crypto';
import { Validation } from '@ne1410s/codl';
import { IAccount, AccountResponse } from './base';
import { IToken } from '../token/base';

export class CreateAccountRequest implements IToken {
  @Validation.required
  token: string;

  @Validation.required
  termsAgreed: boolean;

  @Validation.required
  @Validation.minLength(1)
  @Validation.regex(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)
  emails: Array<string>;
}

export class CreateAccountPayload {
  contact: Array<string>;
  onlyReturnExisting: boolean;
  termsOfServiceAgreed: boolean;
}

export class CreateAccountResponse extends AccountResponse implements IAccount {
  @Validation.required
  accountId: number;

  @Validation.required
  keys: IKeyPair_Jwk;
}
