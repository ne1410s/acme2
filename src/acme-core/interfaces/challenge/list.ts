import { IDomainIdentfier } from "../order/upsert";
import { IChallenge } from "./base";

export interface IListChallengesRequest {
    authCode: string;
}

export interface IListChallengesResponse {
    challenges: Array<IChallenge>;
    expires: Date;
    identifier: IDomainIdentfier;
    status: string;
    wildcard: boolean;
    authCode: string;
}
