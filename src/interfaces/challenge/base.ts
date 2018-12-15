
export interface IChallengeRequest {
    authCode: string;
}

export interface IChallenge {
    status: string;
    token: string;
    type: string;
    url: string;
}
