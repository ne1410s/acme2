import { OperationBase, ValidationError, HttpResponseError } from "@ne1410s/http";
import { Acme2Service } from "../../../acme-core/services/acme2";
import { IOrderResponse } from "../../../acme-core/interfaces/order/base";
import { DbContext } from "../../../database/db-context";
import { IDomainClaim } from "../../interfaces/challenge";
import { IOrderRequest, IOrder } from "../../interfaces/order";

export class GetOrderOperation extends OperationBase<IOrderRequest, IOrder> {

    constructor(private readonly db: DbContext) {
        super();
    }

    validateRequest(requestData: IOrderRequest): void {}
    validateResponse(responseData: IOrder): void {}

    protected async invokeInternal(requestData: IOrderRequest): Promise<IOrder> {

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

        const keys = JSON.parse(db_order.Account.JWKPair),
              env = db_order.Account.IsTest ? 'staging' : 'production',
              svc = new Acme2Service(env as any),
              svc_order = await svc.orders.get.invoke({
                accountId: db_order.AccountID,
                orderId: db_order.OrderID
              }).catch(err => {
                do { err = err.cause || err } // establish root cause
                while (err.cause);
                if ((err as HttpResponseError).statusCode === 404) {
                  console.log('GET Order 404 -> assume expiry.', err.url);
                  return {
                    orderId: db_order.OrderID,
                    status: 'expired',
                    authCodes: []
                  } as IOrderResponse;
                }
                
                throw err;
              })
        
        const domainClaims = [] as Array<IDomainClaim>;
        for (let i = 0; i < svc_order.authCodes.length; i++) {
            const authCode = svc_order.authCodes[i],
                  claim = await this.getDomainClaim(svc, requestData.orderId, keys.publicJwk, authCode);
            domainClaims.push(claim);
        }

        let certCode;
        if (svc_order.certificateUrl) {
            const parts = svc_order.certificateUrl.split('/');
            certCode = parts[parts.length - 1];
        }

        return {
            orderId: svc_order.orderId,
            expires: svc_order.expires,
            status: svc_order.status,
            certCode,
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
                .sort((d1, d2) => d1.type > d2.type ? 1 : d2.type > d1.type ? -1 : 0)
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