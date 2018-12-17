import { IDomainIdentfier } from "../order/upsert";

export interface IChallenge {
    status: string;
    token: string;
    type: string;
    url: string;
}

export interface IFulfilmentData {
    implemented: boolean;
    keyAuth: string;
    title: string;
    content: string;
    more: any;
}

export interface IChallengeDetail extends IChallenge {
    id: number;
    authCode: string;
    fulfilmentData: IFulfilmentData;
}