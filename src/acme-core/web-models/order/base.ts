import { Validation } from '@ne1410s/codl';
import { IToken } from '../token/base';
import { DomainIdentfier } from './upsert';

export class OrderRequest {
  @Validation.required
  accountId: number;

  @Validation.required
  orderId: number;
}

export class OrderResponse {
  @Validation.required
  orderId: number;

  @Validation.required
  status: string;

  @Validation.required
  orderUrl: string;
  certificateUrl?: string;

  @Validation.required
  expires: Date;
  identifiers: Array<DomainIdentfier>;

  @Validation.required
  @Validation.minLength(1)
  authCodes: Array<string>;

  @Validation.required
  @Validation.minLength(1)
  finaliseUrl: string;
}

export class ActiveOrderResponse extends OrderResponse implements IToken {
  token: string;
}
