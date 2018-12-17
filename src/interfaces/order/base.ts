import { IResponse } from "../token/base";
import { IDomainIdentfier } from "./upsert";

export interface IOrderRequest {
    accountId: number;
    orderId: number;
}

export interface IOrderResponse {
    orderId: number;
    status: string;
    orderUrl: string;
    expires: Date;
    identifiers: Array<IDomainIdentfier>;
    authCodes: Array<string>;
    finaliseUrl: string;
}

export interface IActiveOrderResponse extends IResponse, IOrderResponse { }