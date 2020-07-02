import { IToken } from '../token/base';
import { Validation } from '@ne1410s/codl';

export class DeleteAccountResponse implements IToken {
  @Validation.required
  token: string;

  @Validation.custom((v) => v !== 'deactivated')
  status: string;
}
