import { ISecureRequest } from "../user/auth";

export interface ICreateAccountRequest extends ISecureRequest {
    emails: Array<string>;
    tosAgreed: boolean;
    isTest: boolean;
}

export interface ICreateAccountResponse {
    accountId: number;
}