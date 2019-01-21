import { OperationBase } from "@ne1410s/http";
import { DbContext } from "../../../database/db-context";
import { IAccountMeta, ICreateAccountRequest } from "../../interfaces/account";
import { Acme2Service } from "../../../acme-core/services/acme2";

export class CreateAccountOperation extends OperationBase<ICreateAccountRequest, IAccountMeta> {
    
    constructor(private readonly db: DbContext) {
        super();
    }

    validateRequest(requestData: ICreateAccountRequest): void {}
    validateResponse(responseData: IAccountMeta): void {}
    
    protected async invokeInternal(requestData: ICreateAccountRequest): Promise<IAccountMeta> {
        
        const env = requestData.isTest ? 'staging' : 'production',
              svc = new Acme2Service(env as any),
              tokenResponse = await svc.tokens.get.invoke();

        const svc_account = await svc.accounts.create.invoke({
            token: tokenResponse.token,
            emails: requestData.emails,
            termsAgreed: requestData.tosAgreed
        });

        await this.db.dbAccount.create({
            AccountID: svc_account.accountId,
            UserID: requestData.authenticUserId,
            IsTest: !!requestData.isTest,
            JWKPair: JSON.stringify(svc_account.keys),
            Emails: JSON.stringify(requestData.emails)
        });

        return {
            accountId: svc_account.accountId,
            emails: svc_account.contacts.map(c => c.replace('mailto:', '')),
            isTest: !!requestData.isTest,
            orders: []
        };
    }
}