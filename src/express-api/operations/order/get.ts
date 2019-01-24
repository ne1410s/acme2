import { OperationBase, ValidationError } from "@ne1410s/http";
import { IOrderRequest, IOrder } from "../../interfaces/order";
import { DbContext } from "../../../database/db-context";
import { Acme2Service } from "../../../acme-core/services/acme2";
import { IDomainClaim } from "../../interfaces/challenge";

export class GetOrderOperation extends OperationBase<IOrderRequest, IOrder> {

    constructor(private readonly db: DbContext) {
        super();
    }

    validateRequest(requestData: IOrderRequest): void {}
    validateResponse(responseData: IOrder): void {}

    protected async invokeInternal(requestData: IOrderRequest): Promise<IOrder> {

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
              env = db_order.Account.IsTest ? 'staging' : 'production',
              svc = new Acme2Service(env as any),
              svc_order = await svc.orders.get.invoke({
                accountId: db_order.AccountID,
                orderId: db_order.OrderID
              });
        
        const domainClaims = [] as Array<IDomainClaim>;
        for (let i = 0; i < svc_order.authCodes.length; i++) {
            const authCode = svc_order.authCodes[i],
                  claim = await this.getDomainClaim(svc, requestData.orderId, keys.publicJwk, authCode);
            domainClaims.push(claim);
        }

        return {
            orderId: svc_order.orderId,
            expires: svc_order.expires,
            status: svc_order.status,
            certificateUrl: svc_order.certificateUrl,
            finaliseUrl: svc_order.finaliseUrl,
            domainClaims,
        };
    }

    private async getDomainClaim(svc: Acme2Service, orderId: number, publicJwk: JsonWebKey, authCode: string): Promise<IDomainClaim> {

        const svc_challenge = await svc.challenges.list.invoke({ authCode }),
              svc_details = await svc.challenges.detail.invoke({ listResponse: svc_challenge, publicJwk });

        return {
            status: svc_challenge.status,
            domain: svc_challenge.identifier.value,
            wildcard: svc_challenge.wildcard,
            expires: svc_challenge.expires,
            challenges: svc_details.detail
                .filter(d => d.fulfilmentData.implemented)
                .map(d => ({
                    challengeId: d.challengeId,
                    orderId,
                    authCode: d.authCode,
                    keyAuth: d.fulfilmentData.keyAuth,
                    type: d.type,
                    status: d.status,
                    title: d.fulfilmentData.title,
                    content: d.fulfilmentData.content          
                }))
        };
    }
}