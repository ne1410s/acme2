import { CreateAccountOperation } from "./create";
import { GetAccountOperation } from "./get";
import { UpdateAccountOperation } from "./update";
import { DeleteAccountOperation } from "./delete";

export class AccountOperations {

    public readonly create: CreateAccountOperation;
    public readonly get: GetAccountOperation;
    public readonly update: UpdateAccountOperation;
    public readonly delete: DeleteAccountOperation;

    constructor(baseUrl: string) {
        this.create = new CreateAccountOperation(baseUrl);
        this.get = new GetAccountOperation(baseUrl);
        this.update = new UpdateAccountOperation(baseUrl);
        this.delete = new DeleteAccountOperation(baseUrl);
    }
}