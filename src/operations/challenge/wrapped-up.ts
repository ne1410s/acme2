import { ListChallengesOperation } from "./list";

export class ChallengeOperations {

    public readonly list: ListChallengesOperation;

    constructor(baseUrl: string) {
        this.list = new ListChallengesOperation(baseUrl);
    }
}