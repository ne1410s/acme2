import { IDomainIdentfier } from "../order/upsert";
import { IChallenge } from "./base";

export interface IChallengeListResponse {
    challenges: Array<IChallenge>;
    expires: Date;
    identifier: IDomainIdentfier;
    status: string;
}