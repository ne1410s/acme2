import { IResponse } from "../token/base";
import { IDomainIdentfier } from "./upsert";

export interface IOrderResponse extends IResponse {
    id: number;
    status: string;
    orderUrl: string;
    expires: Date;
    identifiers: Array<IDomainIdentfier>;
    authorizations: Array<string>;
    finalize: string;
}