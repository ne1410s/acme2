import { DbContext } from "../../../database/dbContext";
import { CreateAccountOperation } from "./create";

export class AccountOperations {

    public readonly create: CreateAccountOperation;

    constructor(db: DbContext) {

        this.create = new CreateAccountOperation(db);
    }
}