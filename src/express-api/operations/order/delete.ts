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
        
        const db_order = await this.db.dbOrder.findOne({
            where: { OrderID: requestData.orderId },
            include: [{
                model: this.db.dbAccount,
                where: { UserID: requestData.authenticUserId }
            }]
        }) as any;

        if (!db_order) {
            console.error('No matching order found:', requestData);
            throw new ValidationError('An error occurred', {}, ['Data inconsistency']);
        }

        await this.db.dbOrder.destroy({
            where: { OrderID: requestData.orderId }
        });

        return Promise.resolve({});
    }
}