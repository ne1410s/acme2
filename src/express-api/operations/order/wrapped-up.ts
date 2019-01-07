import { GetOrderOperation } from "./get";
import { DbContext } from "../../../database/db-context";
import { CreateOrderOperation } from "./create";

export class OrderOperations {

    public readonly get: GetOrderOperation;
    public readonly create: CreateOrderOperation;

    constructor(db: DbContext) {

        this.get = new GetOrderOperation(db);
        this.create = new CreateOrderOperation(db);
    }
}