import { OperationBase, ValidationError } from "@ne1410s/http";
import { IDeleteAccountRequest } from "../../interfaces/account";
import { DbContext } from "../../../database/db-context";
import { Acme2Service } from "../../../acme-core/services/acme2";

export class DeleteAccountOperation extends OperationBase<IDeleteAccountRequest, {}> {
    
    constructor(private readonly db: DbContext) {
        super();
    }

    validateRequest(requestData: IDeleteAccountRequest): void {}
    validateResponse(responseData: {}): void {}

    protected async invokeInternal(requestData: IDeleteAccountRequest): Promise<{}> {
        
        const db_account = await this.db.Account.findByPk(requestData.accountId) as any;

        if (!db_account || db_account.UserID !== requestData.authenticUserId) {
            console.error('No matching account found:', requestData);
            throw new ValidationError('An error occurred', {}, ['Data inconsistency']);
        }

        const env = db_account.IsTest ? 'staging' : 'production' as any,
              svc = new Acme2Service(env),
              token_response = await svc.tokens.get.invoke();

        await svc.accounts.delete.invoke({
             token: token_response.token,
             accountId: requestData.accountId,
             keys: JSON.parse(db_account.JWKPair)
        });

        await this.db.Order.destroy({ where: { AccountID: requestData.accountId } });
        await this.db.Account.destroy({ where: { AccountID: requestData.accountId } });

        return Promise.resolve({});
    }
}