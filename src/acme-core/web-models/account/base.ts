import { IKeyPair_Jwk } from '@ne1410s/crypto/dist/interfaces';
import { IToken, Token } from '../token/base';
import { Validation } from '@ne1410s/codl';

export interface IAccount {
  accountId: number;
  keys: IKeyPair_Jwk;
}

export interface IAccountRequest extends IAccount, IToken {}
export class AccountRequest implements IAccountRequest {
  @Validation.required
  accountId: number;

  @Validation.required
  keys: IKeyPair_Jwk;

  @Validation.required
  token: string;
}

export class AccountResponse extends Token {
  @Validation.required
  status: string;
  created: Date;
  initialIp: string;
  link: string;
  accountUrl: string;

  @Validation.required
  @Validation.minLength(1)
  contacts: Array<string>;
}
