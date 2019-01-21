import { ISecureRequest } from "./auth";
import { IDomainClaim } from "./challenge";

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

// TODO: Replenish
// export interface IOrder {
//     orderId: number;
//     status: string;
//     expires: Date;
//     domainClaims: Array<IDomainClaim>;
//     certificateUrl?: string;
//     finaliseUrl: string;
// }