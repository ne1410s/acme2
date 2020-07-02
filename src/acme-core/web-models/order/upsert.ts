import { IKeyPair_Jwk } from '@ne1410s/crypto';
import { Validation } from '@ne1410s/codl';
import { AccountRequest } from '../account/base';

export class UpsertOrderRequest extends AccountRequest {
  @Validation.required
  accountId: number;

  @Validation.required
  keys: IKeyPair_Jwk;

  @Validation.required
  token: string;

  @Validation.required
  @Validation.minLength(1)
  domains: Array<string>;
  startsOn?: Date;
  endsOn?: Date;
}

export class DomainIdentfier {
  type: string;
  value: string;
}

export class UpsertOrderPayload {
  identifiers: Array<DomainIdentfier>;
  notBefore?: string;
  notAfter?: string;
}
