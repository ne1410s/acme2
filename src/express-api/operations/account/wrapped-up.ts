import { DbContext } from "../../../database/db-context";
import { CreateAccountOperation } from "./create";

export class AccountOperations {

    public readonly create: CreateAccountOperation;

    constructor(db: DbContext) {

        this.create = new CreateAccountOperation(db);
    }
}