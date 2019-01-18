import { OperationBase } from "@ne1410s/http";
import { ISecureRequest } from "../../interfaces/auth";
import { IAccount } from "../../interfaces/account";
import { DbContext } from "../../../database/db-context";
import { Acme2Service } from "../../../acme-core/services/acme2";
import { IOrderMeta } from "../../interfaces/order";

export class ListAccountsOperation extends OperationBase<ISecureRequest, Array<IAccount>> {
    
    constructor(private readonly db: DbContext) {
        super();
    }
    
    validateRequest(requestData: ISecureRequest): void {}
    validateResponse(responseData: Array<IAccount>): void {}
    
    protected async invokeInternal(requestData: ISecureRequest): Promise<IAccount[]> {
        
        const predicate = { where: { UserID: requestData.authenticUserId }},
              db_accounts = await this.db.dbAccount.findAll(predicate);
        
        // TODO: Promise.all and map, etc...
        const retVal = [] as Array<IAccount>;
        for (let i = 0; i < db_accounts.length; i++) {

            const db_account = db_accounts[i] as any,
                  env = db_account.IsTest ? 'staging' : 'production',
                  svc = new Acme2Service(env as any),
                  token_response = await svc.tokens.get.invoke();

            const svc_account = await svc.accounts.get.invoke({
                token: token_response.token,
                accountId: db_account.AccountID,
                keys: JSON.parse(db_account.JWKPair)
            });

            if (svc_account.status === 'valid') {
                const orders = await this.getOrderMetas(db_account.AccountID);
                retVal.push({
                    accountId: db_account.AccountID,
                    created: svc_account.created,
                    emails: svc_account.contacts.map(c => c.replace('mailto:', '')),
                    status: svc_account.status,
                    isTest: db_account.IsTest,
                    orders: orders
                });
            }
            else if (svc_account.status === 'deactivated') {
                await this.db.dbOrder.destroy({ where: { AccountID: db_account.AccountID } });
                await this.db.dbAccount.destroy({ where: { AccountID: db_account.AccountID } });
                console.log(`Account ${db_account.AccountID} is deactivated. All references have now been removed`);
            }
        }
        
        return retVal;
    }

    private async getOrderMetas(accountId: number): Promise<Array<IOrderMeta>> {

        const predicate = { where: { AccountID: accountId }},
              db_orders = await this.db.dbOrder.findAll(predicate);

        // TODO: Promise.all and map, etc...
        const retVal = [] as Array<IOrderMeta>;
        for(let i = 0; i < db_orders.length; i++) {

            const db_order = db_orders[i] as any;   
            retVal.push({
                orderId: db_order.OrderID,
                domains: JSON.parse(db_order.Domains)
            });
        }

        return retVal;
    }
}