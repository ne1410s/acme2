import { IAccount, IAccountResponse } from "./base";
import { IRequest } from "../token/base";

export interface ICreateAccountRequest extends IRequest {
    termsAgreed: boolean;
    emails: Array<string>;
}

export interface ICreateAccountPayload {
    contact: Array<string>;
    onlyReturnExisting: boolean;
    termsOfServiceAgreed: boolean;
}

export interface ICreateAccountResponse extends IAccount, IAccountResponse { }