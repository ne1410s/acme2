import { OperationBase, ValidationError } from "@ne1410s/http";
import { IUpdateAccountRequest, IAccountMeta } from "../../interfaces/account";
import { DbContext } from "../../../database/db-context";
import { Acme2Service } from "../../../acme-core/services/acme2";

export class UpdateAccountOperation extends OperationBase<IUpdateAccountRequest, IAccountMeta> {

    constructor(private readonly db: DbContext) {
        super();
    }

    validateRequest(requestData: IUpdateAccountRequest): void {}
    validateResponse(responseData: IAccountMeta): void {}

    protected async invokeInternal(requestData: IUpdateAccountRequest): Promise<IAccountMeta> {
        
        const db_account = await this.db.Account.findByPk(requestData.accountId) as any;

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

        const outEmails = svc_account.contacts.map(c => c.replace('mailto:', ''));

        await this.db.Account.update(
            { Emails: JSON.stringify(outEmails) },
            { where: { AccountID: db_account.AccountID }
        });

        return {
            accountId: requestData.accountId,
            isTest: db_account.IsTest,
            emails: outEmails,
        } as IAccountMeta;
    }
}