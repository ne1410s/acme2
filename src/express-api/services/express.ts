import { UserOperations } from "../operations/user/wrapped-up";
import { DbContext } from "../../database/db-context";
import { AccountOperations } from "../operations/account/wrapped-up";
import { OrderOperations } from "../operations/order/wrapped-up";
import { ChallengeOperations } from "../operations/challenge/wrapped-up";

export class ExpressService {

    public readonly users: UserOperations;
    public readonly accounts: AccountOperations;
    public readonly orders: OrderOperations;
    public readonly challenges: ChallengeOperations;

    constructor(db: DbContext) {

        this.users = new UserOperations(db);
        this.accounts = new AccountOperations(db);
        this.orders = new OrderOperations(db);
        this.challenges = new ChallengeOperations(db);
    }
}