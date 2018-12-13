import { IAccountRequest } from "../account/base";

export interface IUpsertOrderRequest extends IAccountRequest {
    domains: Array<string>;
    startsOn?: Date;
    endsOn?: Date;
}

export interface IDomainIdentfier {
    type: string;
    value: string;
}

export interface IUpsertOrderPayload {
    identifiers: Array<IDomainIdentfier>;
    notBefore?: string;
    notAfter?: string;
}
