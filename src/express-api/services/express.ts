import { UserOperations } from "../operations/user/wrapped-up";
import { DbContext } from "../../database/dbContext";
import { AccountOperations } from "../operations/account/wrapped-up";

export class ExpressService {

    public readonly users: UserOperations;
    public readonly accounts: AccountOperations;

    constructor(db: DbContext) {

        this.users = new UserOperations(db);
        this.accounts = new AccountOperations(db);
    }
}