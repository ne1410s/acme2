import { ICsr_Result, IKeyPair_Jwk } from '@ne1410s/crypto/dist/interfaces';
import { IToken } from '../token/base';
import { IAccountRequest } from '../account/base';
import { OrderRequest } from './base';
import { DomainIdentfier } from './upsert';
import { Validation } from '@ne1410s/codl';

export class FinaliseOrderRequest extends OrderRequest implements IAccountRequest {
  @Validation.required
  keys: IKeyPair_Jwk;

  @Validation.required
  token: string;

  @Validation.required
  @Validation.minLength(1)
  identifiers: Array<DomainIdentfier>;

  @Validation.forbidden
  originalCsr?: ICsr_Result;

  company?: string;
  department?: string;
}

export class FinaliseOrderPayload {
  csr: string;
}

export class FinaliseOrderResponse implements IToken {
  @Validation.required
  token: string;

  @Validation.required
  status: string;

  @Validation.required
  expires: Date;

  certificateUrl: string;

  @Validation.required
  originalCsr: ICsr_Result;
}
