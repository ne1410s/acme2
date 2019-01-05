import { ISecureRequest } from "../user/auth";

export interface ICreateAccountRequest extends ISecureRequest {
    emails: Array<string>;
    tosAgreed: boolean;
}

export interface ICreateAccountResponse {
    treestikins: boolean;
}