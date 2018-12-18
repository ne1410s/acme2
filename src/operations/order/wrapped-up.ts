import { UpsertOrderOperation } from "./upsert";
import { GetOrderOperation } from "./get";
import { FinaliseOrderOperation } from "./finalise";
import { GetCertOperation } from "./get-cert";

export class OrderOperations {

    public readonly upsert: UpsertOrderOperation;
    public readonly get: GetOrderOperation;
    public readonly finalise: FinaliseOrderOperation;
    public readonly getCert: GetCertOperation;

    constructor(baseUrl: string) {
        this.upsert = new UpsertOrderOperation(baseUrl);
        this.get = new GetOrderOperation(baseUrl);
        this.finalise = new FinaliseOrderOperation(baseUrl);
        this.getCert = new GetCertOperation(baseUrl);
    }
}