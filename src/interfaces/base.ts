import { IKeyPair_Jwk } from "@ne1410s/crypto/dist/interfaces";

export interface IToken {
    token: string;
}

export interface IAccount {
    id: number;
    keys: IKeyPair_Jwk;
}

export interface IAccountDetails {
    status: string;
    created: Date;
    initialIp: string;
    link: string;
    url: string;
}

export interface IRequest extends IToken { }

export interface IAccountRequest extends IRequest, IAccount { }

export interface IResponse extends IToken { }

export interface IAccountResponse extends IResponse, IAccountDetails { }