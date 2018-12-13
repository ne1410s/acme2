import { IToken, IAccount, IRequest, IAccountResponse } from "./base";

export interface ICreateAccountRequest extends IRequest {
    termsAgreed: boolean;
    emails: Array<string>;
}

export interface ICreateAccountResponse extends IAccount, IAccountResponse {

}