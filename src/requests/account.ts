
export interface IAccountDetails {
    accountId: number;
    secret: JsonWebKey;
}

export interface ICreateAccountRequest {
    termsAgreed: boolean;
    emails: Array<string>;
}
