import { IResponse } from "../token/base";
import { IDomainIdentfier } from "./upsert";

export interface IOrderRequest {
    accountId: number;
    orderId: number;
}

export interface IOrderResponse {
    id: number;
    status: string;
    orderUrl: string;
    expires: Date;
    identifiers: Array<IDomainIdentfier>;
    authorizations: Array<string>;
    finalize: string;
}

export interface IActiveOrderResponse extends IResponse, IOrderResponse { }