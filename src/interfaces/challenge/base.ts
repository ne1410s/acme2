import { IDomainIdentfier } from "../order/upsert";
import { IFulfilmentData } from "./fulfil";

export interface IChallengeRequest {
    authCode: string;
}

export interface IChallenge {
    status: string;
    token: string;
    type: string;
    url: string;
    fulfilmentData: IFulfilmentData;
}

export interface IChallengeResponse {
    challenges: Array<IChallenge>;
    expires: Date;
    identifier: IDomainIdentfier;
    status: string;
}
