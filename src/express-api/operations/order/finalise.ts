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

        const finalise_response = await svc.orders.finalise.invoke({
            accountId: db_order.AccountID,
            orderId: db_order.OrderID,
            token: token_response.token,
            keys,
            identifiers,
            company: requestData.company,
            department: requestData.department
        });

        if (finalise_response.status === 'valid') {
            await this.db.dbOrder.update(
                { CertPrivateKeyDER: finalise_response.originalCsr.der },
                { where: { OrderID: db_order.OrderID }
            });
        } 
        else {
            console.log('------------------------');
            console.log('Invalid Response!', finalise_response);
        }

        return Promise.resolve({});
    }
}