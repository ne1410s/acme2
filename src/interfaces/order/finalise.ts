import { IResponse } from "../token/base";
import { IAccountRequest } from "../account/base";
import { IOrderRequest } from "./base";
import { IDomainIdentfier } from "./upsert";

export interface IFinaliseOrderRequest extends IOrderRequest, IAccountRequest {
    identifiers: Array<IDomainIdentfier>;
}

export interface IFinaliseOrderPayload {
    csr: string;
}

export interface IFinaliseOrderResponse extends IResponse {
    status: string;
    expires: Date;
    certificateUrl: string;
}