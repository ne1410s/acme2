import { OperationBase } from "@ne1410s/http";
import { ICreateOrderRequest, IOrder } from "../../interfaces/order";
import { DbContext } from "../../../database/db-context";
import { AuthError } from "../../errors/auth";
import { Acme2Service } from "../../../acme-core/services/acme2";

export class CreateOrderOperation extends OperationBase<ICreateOrderRequest, IOrder> {
    
    constructor(private readonly db: DbContext) {
        super();
    }

    validateRequest(requestData: ICreateOrderRequest): void {}
    validateResponse(responseData: IOrder): void {}
    
    protected async invokeInternal(requestData: ICreateOrderRequest): Promise<IOrder> {
        
        const db_account = await this.db.dbAccount.findByPk(requestData.accountId) as any;

        if (!db_account || db_account.UserID !== requestData.authenticUserId) {
            console.error('No matching account found:', requestData);
            throw new AuthError();
        }

        const env = db_account.IsTest ? 'staging' : 'production' as any,
              svc = new Acme2Service(env),
              token_response = await svc.tokens.get.invoke();
              
        const svc_order = await svc.orders.upsert.invoke({
            token: token_response.token,
            accountId: requestData.accountId,
            domains: requestData.domains,
            keys: JSON.parse(db_account.JWKPair)
        });

        await this.db.dbOrder.create({
            AccountID: requestData.accountId,
            OrderID: svc_order.orderId,
            Domains: JSON.stringify(requestData.domains),
            CertPrivateKeyDER: null
        });

        return {
            orderId: svc_order.orderId,
            domains: requestData.domains,
            expires: svc_order.expires,
            status: svc_order.status
        };
    }
}