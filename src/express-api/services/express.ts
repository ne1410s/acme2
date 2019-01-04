import { UserOperations } from "../operations/user/wrapped-up";
import { DbContext } from "../../database/dbContext";

export class ExpressService {

    public readonly users: UserOperations;

    constructor(db: DbContext) {

        this.users = new UserOperations(db);
    }
}