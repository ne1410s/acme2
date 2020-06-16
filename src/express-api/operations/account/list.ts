import { OperationBase } from "@ne1410s/http";
import { ISecureRequest } from "../../interfaces/auth";
import { IAccountMeta } from "../../interfaces/account";
import { DbContext } from "../../../database/db-context";

export class ListAccountsOperation extends OperationBase<ISecureRequest, Array<IAccountMeta>> {
    
    constructor(private readonly db: DbContext) {
        super();
    }
    
    validateRequest(requestData: ISecureRequest): void {}
    validateResponse(responseData: Array<IAccountMeta>): void {}
    
    protected async invokeInternal(requestData: ISecureRequest): Promise<IAccountMeta[]> {

        const db_accounts = await this.db.Account.findAll({ 
            where: { UserID: requestData.authenticUserId },
            include: [{ model: this.db.Order }]
        });

        return db_accounts.map((acc: any) => ({
            accountId: acc.AccountID,
            emails: JSON.parse(acc.Emails),
            isTest: acc.IsTest,
            orders: acc.Orders.map((ord: any) => ({
                orderId: ord.OrderID,
                accountId: ord.AccountID,
                domains: JSON.parse(ord.Domains)
            }))
        }));
    }
}