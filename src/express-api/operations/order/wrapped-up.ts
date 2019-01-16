import { GetOrderOperation } from "./get";
import { DbContext } from "../../../database/db-context";
import { CreateOrderOperation } from "./create";
import { DeleteOrderOperation } from "./delete";

export class OrderOperations {

    public readonly get: GetOrderOperation;
    public readonly create: CreateOrderOperation;
    public readonly delete: DeleteOrderOperation;

    constructor(db: DbContext) {

        this.get = new GetOrderOperation(db);
        this.create = new CreateOrderOperation(db);
        this.delete = new DeleteOrderOperation(db);
    }
}