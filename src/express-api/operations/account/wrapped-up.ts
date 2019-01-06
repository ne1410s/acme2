import { DbContext } from "../../../database/db-context";
import { CreateAccountOperation } from "./create";
import { ListAccountsOperation } from "./list";

export class AccountOperations {

    public readonly create: CreateAccountOperation;
    public readonly list: ListAccountsOperation;

    constructor(db: DbContext) {

        this.create = new CreateAccountOperation(db);
        this.list = new ListAccountsOperation(db);
    }
}