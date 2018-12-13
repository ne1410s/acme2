import { GetTokenOperation } from "./get";

export class TokenOperations {

    public readonly get: GetTokenOperation;

    constructor(baseUrl: string) {
        this.get = new GetTokenOperation(baseUrl);
    }
}