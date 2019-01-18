import { OperationBase, ValidationError } from "@ne1410s/http";
import { IOrderRequest } from "../../interfaces/order";
import { DbContext } from "../../../database/db-context";

export class DeleteOrderOperation extends OperationBase<IOrderRequest, {}> {
    
    constructor(private readonly db: DbContext) {
        super();
    }

    validateRequest(requestData: IOrderRequest): void {}
    validateResponse(responseData: {}): void {}

    protected async invokeInternal(requestData: IOrderRequest): Promise<{}> {
        
        const db_account = await this.db.dbAccount.findByPk(requestData.accountId) as any;

        if (!db_account || db_account.UserID !== requestData.authenticUserId) {
            console.error('No matching account found:', requestData);
            throw new ValidationError('An error occurred', {}, ['Data inconsistency']);
        }

        const db_order = await this.db.dbOrder.findByPk(requestData.orderId) as any;

        if (!db_order || db_order.AccountID != requestData.accountId) {
            console.error('No matching order found:', requestData);
            throw new ValidationError('An error occurred', {}, ['Data inconsistency']);
        }

        await this.db.dbOrder.destroy({
            where: { OrderID: requestData.orderId }
        });

        return Promise.resolve({});
    }
}