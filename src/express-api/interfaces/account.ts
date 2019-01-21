import { ISecureRequest } from "./auth";
import { IOrderMeta } from "./order";

export interface ICreateAccountRequest extends ISecureRequest {
    emails: Array<string>;
    tosAgreed: boolean;
    isTest: boolean;
}

export interface IUpdateAccountRequest extends ISecureRequest {
    accountId: number;
    isTest: boolean;
    emails: Array<string>;
}

export interface IDeleteAccountRequest extends ISecureRequest {
    accountId: number;
}

export interface IAccountMeta {
    accountId: number;
    emails: Array<string>;
    isTest: boolean;
    orders: Array<IOrderMeta>;
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