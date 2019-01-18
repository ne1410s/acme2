import { OperationBase, ValidationError } from "@ne1410s/http";
import { IOrderRequest, IOrder } from "../../interfaces/order";
import { DbContext } from "../../../database/db-context";
import { Acme2Service } from "../../../acme-core/services/acme2";

export class GetOrderOperation extends OperationBase<IOrderRequest, IOrder> {
    
    constructor(private readonly db: DbContext) {
        super();
    }
    
    validateRequest(requestData: IOrderRequest): void {}
    validateResponse(responseData: IOrder): void {}

    protected async invokeInternal(requestData: IOrderRequest): Promise<IOrder> {
        
        const db_account = await this.db.dbAccount.findByPk(requestData.accountId) as any;

        if (!db_account || db_account.UserID !== requestData.authenticUserId) {
            console.error('No matching account found:', requestData);
            throw new ValidationError('An error occurred', {}, ['Data inconsistency']);
        }

        const db_order = await this.db.dbOrder.findByPk(requestData.orderId) as any;

        if (!db_order) {
            console.error('No matching order found:', requestData);
            throw new ValidationError('An error occurred', {}, ['Data inconsistency']);
        }

        const env = db_account.IsTest ? 'staging' : 'production' as any,
              svc = new Acme2Service(env),
              svc_order = await svc.orders.get.invoke({ accountId: requestData.accountId, orderId: requestData.orderId });

        return {
            orderId: db_order.OrderID,
            domains: JSON.parse(db_order.Domains),
            status: svc_order.status,
            expires: svc_order.expires
        };
    }
}