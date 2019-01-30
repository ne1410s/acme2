import { OperationBase, ValidationError } from "@ne1410s/http";
import { IFinaliseOrderRequest } from "../../interfaces/order";
import { DbContext } from "../../../database/db-context";
import { Acme2Service } from "../../../acme-core/services/acme2";

export class FinaliseOrderOperation extends OperationBase<IFinaliseOrderRequest, {}> {
    
    constructor(private readonly db: DbContext) {
        super();
    }

    validateRequest(requestData: IFinaliseOrderRequest): void {}
    validateResponse(responseData: {}): void {}

    protected async invokeInternal(requestData: IFinaliseOrderRequest): Promise<{}> {
        
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

        const keys = JSON.parse(db_order.Account.JWKPair),
              identifiers = JSON.parse(db_order.Domains).map((d: any) => ({ type: 'dns', value: d })),
              env = db_order.Account.IsTest ? 'staging' : 'production',
              svc = new Acme2Service(env as any),
              token_response = await svc.tokens.get.invoke();

        const svc_response = await svc.orders.finalise.invoke({
            accountId: db_order.AccountID,
            orderId: db_order.OrderID,
            token: token_response.token,
            keys,
            identifiers,
            company: requestData.company,
            department: requestData.department
        });

        if (svc_response.status !== 'valid') {
            console.log('Unable to finalise order', svc_response);
            throw new ValidationError('Unable to finalise order', svc_response);
        } 
        
        await this.db.dbOrder.update(
            { CertPkcs8_Base64: svc_response.originalCsr.pkcs8_b64 },
            { where: { OrderID: db_order.OrderID }
        });

        // service status was valid; but order status requires polling
        let pollStatusOutcome = 'pending',
            pollCount = 0,
            svc_order;

        while (pollStatusOutcome === 'pending' && ++pollCount <= 5) {
            svc_order = await svc.orders.get.invoke({
                accountId: db_order.AccountID,
                orderId: db_order.OrderID
            });
            pollStatusOutcome = svc_order.status;
        }

        return Promise.resolve({});
    }
}