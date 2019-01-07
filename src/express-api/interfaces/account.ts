import { ISecureRequest } from "./auth";
import { IOrderMeta } from "./order";

export interface ICreateAccountRequest extends ISecureRequest {
    emails: Array<string>;
    tosAgreed: boolean;
    isTest: boolean;
}

export interface IAccount {
    accountId: number;
    created: Date;
    status: string;
    emails: Array<string>;
    isTest: boolean;
    orders: Array<IOrderMeta>;
}