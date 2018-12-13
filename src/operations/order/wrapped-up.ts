import { UpsertOrderOperation } from "./upsert";

export class OrderOperations {

    public readonly upsert: UpsertOrderOperation;

    constructor(baseUrl: string) {
        this.upsert = new UpsertOrderOperation(baseUrl);
    }
}