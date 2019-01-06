import { OperationBase } from "@ne1410s/http";
import { ISecureRequest } from "../../interfaces/auth";
import { IAccount } from "../../interfaces/account";
import { DbContext } from "../../../database/db-context";
import { Acme2Service } from "../../../acme-core/services/acme2";

export class ListAccountsOperation extends OperationBase<ISecureRequest, Array<IAccount>> {
    
    constructor(private readonly db: DbContext) {
        super();
    }
    
    validateRequest(requestData: ISecureRequest): void {}
    validateResponse(responseData: Array<IAccount>): void {}
    
    protected async invokeInternal(requestData: ISecureRequest): Promise<IAccount[]> {
        
        const predicate = { where: { UserID: requestData.authenticUserId }};
        const accounts = await this.db.dbAccount.findAll(predicate);
        
        // TODO: Promise.all and map, etc...
        const retVal = [] as Array<IAccount>;
        for (let i = 0; i < accounts.length; i++) {

            const db_account = accounts[i] as any,
                  env = db_account.IsTest ? 'staging' : 'production',
                  svc = new Acme2Service(env as any);
            
            const tokenResponse = await svc.tokens.get.invoke(),
                  svc_account = await svc.accounts.get.invoke({
                token: tokenResponse.token,
                accountId: db_account.AccountID,
                keys: JSON.parse(db_account.JWKPair)
            });

            retVal.push({
                created: svc_account.created,
                emails: svc_account.contacts,
                status: svc_account.status,
                isTest: db_account.IsTest
            });
        }
        
        return retVal;
    }
}