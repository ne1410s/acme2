import { DbContext } from "../../../database/db-context";
import { CreateAccountOperation } from "./create";
import { ListAccountsOperation } from "./list";
import { DeleteAccountOperation } from "./delete";
import { UpdateAccountOperation } from "./update";

export class AccountOperations {

    public readonly create: CreateAccountOperation;
    public readonly list: ListAccountsOperation;
    public readonly delete: DeleteAccountOperation;
    public readonly update: UpdateAccountOperation;

    constructor(db: DbContext) {

        this.create = new CreateAccountOperation(db);
        this.list = new ListAccountsOperation(db);
        this.delete = new DeleteAccountOperation(db);
        this.update = new UpdateAccountOperation(db);
    }
}