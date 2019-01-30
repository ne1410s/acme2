import { OperationBase, ValidationError } from "@ne1410s/http";
import { ICertResponse, ICertRequest } from "../../interfaces/order";
import { DbContext } from "../../../database/db-context";
import { Acme2Service } from "../../../acme-core/services/acme2";

export class GetCertOperation extends OperationBase<ICertRequest, ICertResponse> {
    
    constructor(private readonly db: DbContext) {
        super();
    }

    validateRequest(requestData: ICertRequest): void {}
    validateResponse(responseData: ICertResponse): void {}

    protected async invokeInternal(requestData: ICertRequest): Promise<ICertResponse> {

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

        const env = db_order.Account.IsTest ? 'staging' : 'production',
              svc = new Acme2Service(env as any),
              svc_cert = await svc.orders.getCert.invoke({ certCode: requestData.certCode }),
              pem = svc_cert.content;

        if (svc_cert.contentType !== 'application/pem-certificate-chain') {
            throw new ValidationError('Unrecognised certificate format', svc_cert);
        }

        // TODO .p12 support

        return {
            pem
        };
    }
}