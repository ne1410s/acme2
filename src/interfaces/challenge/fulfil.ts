import { IAccountRequest } from "../account/base";
import { IResponse } from "../token/base";

export interface IFulfilmentData {
    keyAuth: string;
    title: string;
    content: string;
}

export interface IHttpFulfilmentData extends IFulfilmentData {
    url: string;
    host: string;
    path: string;
}

export interface IFulfilChallengeRequest extends IAccountRequest {
    orderUrl: string;
}

export interface IFulfilChallengePayload {
    keyAuthorization: string;
}

export interface IFulfilChallengeResponse extends IResponse {
    // TODO!
}