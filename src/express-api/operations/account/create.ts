import { OperationBase } from "@ne1410s/http";
import { DbContext } from "../../../database/db-context";
import { IAccount, ICreateAccountRequest } from "../../interfaces/account";
import { Acme2Service } from "../../../acme-core/services/acme2";

export class CreateAccountOperation extends OperationBase<ICreateAccountRequest, IAccount> {
    
    constructor(private readonly db: DbContext) {
        super();
    }

    validateRequest(requestData: ICreateAccountRequest): void {}
    validateResponse(responseData: IAccount): void {}
    
    protected async invokeInternal(requestData: ICreateAccountRequest): Promise<IAccount> {
        
        const env = requestData.isTest ? 'staging' : 'production',
              svc = new Acme2Service(env as any);

        const tokenResponse = await svc.tokens.get.invoke(),
              svcResponse = await svc.accounts.create.invoke({
            token: tokenResponse.token,
            emails: requestData.emails,
            termsAgreed: requestData.tosAgreed
        });

        await this.db.dbAccount.create({
            AccountID: svcResponse.accountId,
            UserID: requestData.authenticUserId,
            IsTest: !!requestData.isTest,
            JWKPair: JSON.stringify(svcResponse.keys)
        });

        return {
            accountId: svcResponse.accountId,
            created: svcResponse.created,
            status: svcResponse.status,
            emails: requestData.emails,
            isTest: !!requestData.isTest,
            orders: []
        };
    }
}