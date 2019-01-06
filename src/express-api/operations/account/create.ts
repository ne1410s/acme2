import { OperationBase } from "@ne1410s/http";
import { DbContext } from "../../../database/db-context";
import { ICreateAccountResponse, ICreateAccountRequest } from "../../interfaces/account/create";
import { Acme2Service } from "../../../acme-core/services/acme2";

export class CreateAccountOperation extends OperationBase<ICreateAccountRequest, ICreateAccountResponse> {
    
    constructor(private readonly db: DbContext) {
        super();
    }

    validateRequest(requestData: ICreateAccountRequest): void {}
    validateResponse(responseData: ICreateAccountResponse): void {}
    
    protected async invokeInternal(requestData: ICreateAccountRequest): Promise<ICreateAccountResponse> {
        
        const env = requestData.isTest ? 'staging' : 'production',
              svc = new Acme2Service(env as any);

        const tokenResponse = await svc.tokens.get.invoke(),
              svcResponse = await svc.accounts.create.invoke({
            token: tokenResponse.token,
            emails: requestData.emails,
            termsAgreed: requestData.tosAgreed
        });

        const newAccount = await this.db.dbAccount.create({
            AccountID: svcResponse.accountId,
            UserID: requestData.authenticUserId,
            IsTest: !!requestData.isTest,
            JWKPair: JSON.stringify(svcResponse.keys)
        }) as any;

        return { 
            accountId: newAccount.AccountID
        }
    }
}