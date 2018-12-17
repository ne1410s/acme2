import { UpsertOrderOperation } from "./upsert";
import { GetOrderOperation } from "./get";
import { FinaliseOrderOperation } from "./finalise";

export class OrderOperations {

    public readonly upsert: UpsertOrderOperation;
    public readonly get: GetOrderOperation;
    public readonly finalise: FinaliseOrderOperation;

    constructor(baseUrl: string) {
        this.upsert = new UpsertOrderOperation(baseUrl);
        this.get = new GetOrderOperation(baseUrl);
        this.finalise = new FinaliseOrderOperation(baseUrl);
    }
}