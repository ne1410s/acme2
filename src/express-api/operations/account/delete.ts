import { OperationBase } from "@ne1410s/http";
import { IDeleteAccountRequest } from "../../interfaces/account";
import { DbContext } from "../../../database/db-context";
import { AuthError } from "../../errors/auth";
import { Acme2Service } from "../../../acme-core/services/acme2";

export class DeleteAccountOperation extends OperationBase<IDeleteAccountRequest, {}> {
    
    constructor(private readonly db: DbContext) {
        super();
    }

    validateRequest(requestData: IDeleteAccountRequest): void {}
    validateResponse(responseData: {}): void {}

    protected async invokeInternal(requestData: IDeleteAccountRequest): Promise<{}> {
        
        const db_account = await this.db.dbAccount.findByPk(requestData.accountId) as any;

        if (!db_account || db_account.UserID !== requestData.authenticUserId) {
            console.error('No matching account found:', requestData);
            throw new AuthError();
        }

        const env = db_account.IsTest ? 'staging' : 'production' as any,
              svc = new Acme2Service(env),
              token_response = await svc.tokens.get.invoke();

        await svc.accounts.delete.invoke({
             token: token_response.token,
             accountId: requestData.accountId,
             keys: JSON.parse(db_account.JWKPair)
        });

        await this.db.dbAccount.destroy({
            where: { AccountID: requestData.accountId }
        });

        return Promise.resolve({});
    }
}