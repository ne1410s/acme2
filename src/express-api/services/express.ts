import { UserOperations } from "../operations/user/wrapped-up";

export class ExpressService {

    public readonly users: UserOperations;

    constructor() {

        this.users = new UserOperations();
    }
}