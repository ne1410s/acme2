export interface IChallenge {
    challengeId: number;
    keyAuth: string;
    type: string;
    status: string;
    title: string;
    content: string;
}

export interface IDomainClaim {
    status: string;
    expires: Date;
    domain: string;
    wildcard: boolean;
    challenges: Array<IChallenge>;
}