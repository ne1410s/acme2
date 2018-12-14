import { UpsertOrderOperation } from "./upsert";
import { GetOrderOperation } from "./get";

export class OrderOperations {

    public readonly upsert: UpsertOrderOperation;
    public readonly get: GetOrderOperation;

    constructor(baseUrl: string) {
        this.upsert = new UpsertOrderOperation(baseUrl);
        this.get = new GetOrderOperation(baseUrl);
    }
}