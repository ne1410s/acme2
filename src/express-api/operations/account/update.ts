import { OperationBase, ValidationError } from "@ne1410s/http";
import { IUpdateAccountRequest, IAccount } from "../../interfaces/account";
import { DbContext } from "../../../database/db-context";
import { Acme2Service } from "../../../acme-core/services/acme2";

export class UpdateAccountOperation extends OperationBase<IUpdateAccountRequest, IAccount> {

    constructor(private readonly db: DbContext) {
        super();
    }

    validateRequest(requestData: IUpdateAccountRequest): void {}
    validateResponse(responseData: IAccount): void {}

    protected async invokeInternal(requestData: IUpdateAccountRequest): Promise<IAccount> {
        
        const db_account = await this.db.dbAccount.findByPk(requestData.accountId) as any;

        if (!db_account || db_account.UserID !== requestData.authenticUserId || db_account.IsTest !== requestData.isTest) {
            console.error('No matching account found:', requestData);
            throw new ValidationError('An error occurred', {}, ['Data inconsistency']);
        }

        const env = db_account.IsTest ? 'staging' : 'production',
              svc = new Acme2Service(env as any),
              token_response = await svc.tokens.get.invoke();

        const svc_account = await svc.accounts.update.invoke({
            token: token_response.token,
            accountId: requestData.accountId,
            emails: requestData.emails,
            keys: JSON.parse(db_account.JWKPair)
        });

        return {
            accountId: requestData.accountId,
            isTest: db_account.IsTest,
            status: svc_account.status,
            emails: svc_account.contacts.map(c => c.replace('mailto:', '')),
            created: svc_account.created,
            // leave orders undefined in this service
        } as IAccount;
    }
}