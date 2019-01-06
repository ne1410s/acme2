import { ISecureRequest } from "./auth";
import { IOrder } from "./order";

export interface ICreateAccountRequest extends ISecureRequest {
    emails: Array<string>;
    tosAgreed: boolean;
    isTest: boolean;
}

export interface IAccount {
    created: Date;
    status: string;
    emails: Array<string>;
    isTest: boolean;
}