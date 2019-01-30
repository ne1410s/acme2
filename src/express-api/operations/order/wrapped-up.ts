import { DbContext } from "../../../database/db-context";
import { CreateOrderOperation } from "./create";
import { DeleteOrderOperation } from "./delete";
import { GetOrderOperation } from "./get";
import { FinaliseOrderOperation } from "./finalise";
import { GetCertOperation } from "./get-cert";

export class OrderOperations {

    public readonly get: GetOrderOperation;
    public readonly create: CreateOrderOperation;
    public readonly delete: DeleteOrderOperation;
    public readonly finalise: FinaliseOrderOperation;
    public readonly cert: GetCertOperation;

    constructor(db: DbContext) {

        this.get = new GetOrderOperation(db);
        this.create = new CreateOrderOperation(db);
        this.delete = new DeleteOrderOperation(db);
        this.finalise = new FinaliseOrderOperation(db);
        this.cert = new GetCertOperation(db);
    }
}