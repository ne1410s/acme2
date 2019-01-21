import { OperationBase } from "@ne1410s/http";
import { ISecureRequest } from "../../interfaces/auth";
import { IAccountMeta } from "../../interfaces/account";
import { DbContext } from "../../../database/db-context";

export class ListAccountsOperation extends OperationBase<ISecureRequest, Array<IAccountMeta>> {
    
    constructor(private readonly db: DbContext) {
        super();
    }
    
    validateRequest(requestData: ISecureRequest): void {}
    validateResponse(responseData: Array<IAccountMeta>): void {}
    
    protected async invokeInternal(requestData: ISecureRequest): Promise<IAccountMeta[]> {
        
        const db_accounts = await this.db.dbAccount.findAll({ 
            where: { UserID: requestData.authenticUserId },
            include: [{ model: this.db.dbOrder }]
        });

        return db_accounts.map((acc: any) => ({
            accountId: acc.AccountID,
            emails: JSON.parse(acc.Emails),
            isTest: acc.IsTest,
            orders: acc.Orders.map((ord: any) => ({
                orderId: ord.OrderID,
                domains: JSON.parse(ord.Domains)
            }))
        }));
    }


    // TODO: Replenish

    /*
        if (svc_account.status === 'deactivated') {
            await this.db.dbOrder.destroy({ where: { AccountID: db_account.AccountID } });
            await this.db.dbAccount.destroy({ where: { AccountID: db_account.AccountID } });
            console.log(`Account ${db_account.AccountID} is deactivated. All references have now been removed`);
        }
    */

    // private async getOrders(svc: Acme2Service, publicJwk: JsonWebKey, accountId: number): Promise<Array<IOrder>> {

    //     const db_orders = await this.db.dbOrder.findAll({ where: { AccountID: accountId }});

    //     const retVal = [] as Array<IOrder>;
    //     for(let i = 0; i < db_orders.length; i++) {

    //         const db_order = db_orders[i] as any,
    //               orderId = db_order.OrderID,
    //               svc_order = await svc.orders.get.invoke({ accountId, orderId });

    //         retVal.push({
    //             orderId: orderId,
    //             expires: svc_order.expires,
    //             status: svc_order.status,
    //             certificateUrl: svc_order.certificateUrl,
    //             finaliseUrl: svc_order.finaliseUrl,
    //             //domainClaims: await this.getDomainClaims(svc, publicJwk, svc_order.authCodes),
    //             domainClaims: []
    //         });
    //     }

    //     return retVal;
    // }

    // private async getDomainClaims(svc: Acme2Service, publicJwk: JsonWebKey, authCodes: Array<string>): Promise<Array<IDomainClaim>> {

    //     const retVal = [] as Array<IDomainClaim>;

    //     for (let i = 0; i < authCodes.length; i++) {
    
    //         const svc_challenge = await svc.challenges.list.invoke({ authCode: authCodes[i] }),
    //               svc_details = await svc.challenges.detail.invoke({ listResponse: svc_challenge, publicJwk });

    //         retVal.push({
    //             status: svc_challenge.status,
    //             domain: svc_challenge.identifier.value,
    //             wildcard: svc_challenge.wildcard,
    //             expires: svc_challenge.expires,
    //             challenges: svc_details.detail
    //                 .filter(d => d.fulfilmentData.implemented)
    //                 .map(d => ({
    //                     challengeId: d.challengeId,
    //                     keyAuth: d.fulfilmentData.keyAuth,
    //                     type: d.type,
    //                     status: d.status,
    //                     title: d.fulfilmentData.title,
    //                     content: d.fulfilmentData.content          
    //                 }))
    //         });
    //     }

    //     return retVal;
    // }
}