import { CreateAccountOperation } from "./operations/create-account";
import { GetTokenOperation } from "./operations/get-token";
import { GetAccountOperation } from "./operations/get-account";
import { UpdateAccountOperation } from "./operations/update-account";
import { DeleteAccountOperation } from "./operations/delete-account";

export default class Acme2 {
    
    public readonly token: GetTokenOperation;
    public readonly create: CreateAccountOperation;
    public readonly get: GetAccountOperation;
    public readonly update: UpdateAccountOperation;
    public readonly delete: DeleteAccountOperation;

    private readonly urls: any = {
        staging: 'https://acme-staging-v02.api.letsencrypt.org/acme',
        production: 'https://acme-v02.api.letsencrypt.org/acme'
    };

    constructor(env: 'staging | production') {

        const baseUrl = this.urls[env];

        this.token = new GetTokenOperation(baseUrl);
        this.create = new CreateAccountOperation(baseUrl);
        this.get = new GetAccountOperation(baseUrl);
        this.update = new UpdateAccountOperation(baseUrl);
        this.delete = new DeleteAccountOperation(baseUrl);
    }
}