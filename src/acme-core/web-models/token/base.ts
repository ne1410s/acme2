import { Validation } from '@ne1410s/codl';

export interface IToken {
  token: string;
}

export class Token implements IToken {
  @Validation.required
  @Validation.regex(/^[\w-]{43,}$/gi)
  token: string;
}
