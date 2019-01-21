import { ISecureRequest } from "./auth";

export interface ICreateOrderRequest extends ISecureRequest {
    accountId: number;
    domains: Array<string>;
}

export interface IOrderRequest extends ISecureRequest {
    orderId: number;
}

export interface IOrderMeta {
    orderId: number;
    domains: Array<string>;
}

export interface IOrder extends IOrderMeta {
    status: string;
    expires: Date;
}