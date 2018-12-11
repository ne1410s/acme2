import { IKeyPair_Jwk } from "@ne1410s/crypto/dist/interfaces";

export interface IToken {
    token: string;
}

export interface IAccount {
    id: number;
    keys: IKeyPair_Jwk;
}

export interface IAccountRequest extends IAccount, IToken {
}

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