import { Validation } from '@ne1410s/codl';

export interface IToken {
  token: string;
}

export class Token implements IToken {
  @Validation.required
  token: string;
}
