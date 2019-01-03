import { RegisterOperation } from "./register";
import { LoginOperation } from "./login";

export class UserOperations {

    public readonly register: RegisterOperation;
    public readonly login: LoginOperation;

    constructor() {

        this.register = new RegisterOperation();
        this.login = new LoginOperation();
    }

}