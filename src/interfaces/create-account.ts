import { IToken, IAccount } from "./base";

export interface ICreateAccountRequest extends IToken {
    termsAgreed: boolean;
    emails: Array<string>;
}

export interface ICreateAccountResponse extends IAccount, IToken {
    status: string;
    created: Date;
    initialIp: string;
    link: string;
    url: string;
}