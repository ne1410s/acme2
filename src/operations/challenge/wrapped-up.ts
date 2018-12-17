import { ListChallengesOperation } from "./list";
import { GetChallengeDetailOperation } from "./get-detail";

export class ChallengeOperations {

    public readonly list: ListChallengesOperation;
    public readonly detail: GetChallengeDetailOperation;

    constructor(baseUrl: string) {
        this.list = new ListChallengesOperation(baseUrl);
        this.detail = new GetChallengeDetailOperation();
    }
}