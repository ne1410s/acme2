import { ISecureRequest } from "./auth";
import { IDomainClaim } from "./challenge";

export interface ICreateOrderRequest extends ISecureRequest {
    accountId: number;
    domains: Array<string>;
}

export interface IOrderRequest extends ISecureRequest {
    orderId: number;
}

export interface IFinaliseOrderRequest extends IOrderRequest {
    company?: string;
    department?: string;
}

export interface ICertRequest extends IOrderRequest {
    certCode: string;
    certType: string;
    password: string;
}

export interface ICertResponse {
    contentType: string;
    base64: string;
}

export interface IOrderMeta {
    orderId: number;
    accountId: number;
    domains: Array<string>;
}

export interface IOrder {
    orderId: number;
    status: string;
    expires: Date;
    domainClaims: Array<IDomainClaim>;
    certCode?: string;
}