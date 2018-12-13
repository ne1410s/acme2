import { IKeyPair_Jwk } from "@ne1410s/crypto/dist/interfaces";
import { IRequest, IResponse } from "../token/base";

export interface IAccount {
    id: number;
    keys: IKeyPair_Jwk;
}

export interface IAccountDetails {
    status: string;
    created: Date;
    initialIp: string;
    link: string;
    accountUrl: string;
    contacts: Array<string>;
}

export interface IAccountRequest extends IRequest, IAccount { }

export interface IAccountResponse extends IResponse, IAccountDetails { }
