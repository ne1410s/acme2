import { IListChallengesResponse } from "./list";
import { IChallengeDetails } from "./base";

export interface IGetFulfilmentDataRequest {
    publicJwk: JsonWebKey;
    listResponse: IListChallengesResponse;
}

export interface IGetFulfilmentDataResponse {
    detailedChallenges: Array<IChallengeDetails>;
}