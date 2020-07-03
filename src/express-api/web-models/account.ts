import { SecureRequest } from './auth';
import { OrderMeta } from './order';
import { Validation } from '@ne1410s/codl';

export class CreateAccountRequest extends SecureRequest {
  @Validation.required
  @Validation.minLength(1)
  @Validation.regex(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)
  emails: Array<string>;

  @Validation.custom((v) => (v === true ? null : 'You must agree to the terms'))
  tosAgreed: boolean;
  isTest: boolean;
}

export class UpdateAccountRequest extends SecureRequest {
  @Validation.required
  accountId: number;
  isTest: boolean;
  emails: Array<string>;
}

export class DeleteAccountRequest extends SecureRequest {
  @Validation.required
  accountId: number;
}

export class AccountMeta {
  accountId: number;
  emails: Array<string>;
  isTest: boolean;
  orders: Array<OrderMeta>;
}

// TODO: Replenish
// export interface IAccount {
//     accountId: number;
//     created: Date;
//     status: string;
//     emails: Array<string>;
//     isTest: boolean;
//     orders: Array<IOrder>;
// }
