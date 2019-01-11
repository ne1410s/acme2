import { DbContext } from "../../../database/db-context";
import { CreateAccountOperation } from "./create";
import { ListAccountsOperation } from "./list";
import { DeleteAccountOperation } from "./delete";

export class AccountOperations {

    public readonly create: CreateAccountOperation;
    public readonly list: ListAccountsOperation;
    public readonly delete: DeleteAccountOperation;

    constructor(db: DbContext) {

        this.create = new CreateAccountOperation(db);
        this.list = new ListAccountsOperation(db);
        this.delete = new DeleteAccountOperation(db);
    }
}