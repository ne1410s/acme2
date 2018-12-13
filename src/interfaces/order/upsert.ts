import { IAccountRequest } from "../account/base";

export interface IUpsertOrderRequest extends IAccountRequest {
    emails: Array<string>;
}

export interface IDomainIdentfier {
    type: string,
    value: string
}

export interface IUpsertOrderPayload {
    identifiers: Array<IDomainIdentfier>
}
