import * as Crypto from "@ne1410s/crypto";
import * as Text from "@ne1410s/text";
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

        const db_order = await this.db.Order.findOne({
            where: { OrderID: requestData.orderId },
            include: [{
                model: this.db.Account,
                where: { UserID: requestData.authenticUserId }
            }]
        }) as any;

        if (!db_order) {
            console.error('No matching order found:', requestData);
            throw new ValidationError('An error occurred', {}, ['Data inconsistency']);
        }

        const env = db_order.Account.IsTest ? 'staging' : 'production',
              svc = new Acme2Service(env as any),
              svc_cert = await svc.orders.getCert.invoke({ certCode: requestData.certCode });

        if (svc_cert.contentType !== 'application/pem-certificate-chain') {
            throw new ValidationError('Unrecognised certificate format', svc_cert);
        }

        switch (requestData.certType) {
            case 'pfx':
                const pem_parts = Crypto.pemToBase64Parts(svc_cert.content),
                    cert_b64 = pem_parts[0],
                    priv_b64 = db_order.CertPkcs8_Base64,
                    password = (decodeURIComponent(requestData.password) || '').trimRight(),
                    friendlyName = (decodeURIComponent(requestData.friendlyName) || '').trimRight(),
                    buffer = await Crypto.pfx(friendlyName, cert_b64, priv_b64, password);
                return { 
                    contentType: 'application/octet-stream',
                    base64: Text.bufferToBase64(buffer) 
                };
            case 'key.pem':
                const keyPem = Crypto.base64ToPem(db_order.CertPkcs8_Base64, 'private key');
                return {
                    contentType: 'text/plain',
                    base64: Text.textToBase64(`${svc_cert.content}\r\n${keyPem}`) 
                };
            case 'pem':
            default:
                return {
                    contentType: 'text/plain',
                    base64: Text.textToBase64(svc_cert.content) 
                };
        }
    }
}