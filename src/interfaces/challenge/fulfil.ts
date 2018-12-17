import { IAccountRequest } from "../account/base";
import { IResponse } from "../token/base";

export interface IFulfilChallengeRequest extends IAccountRequest {
    orderUrl: string;
}

export interface IFulfilChallengePayload {
    keyAuthorization: string;
}

export interface IFulfilChallengeResponse extends IResponse {
    // TODO!
}