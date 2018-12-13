import { ValidationError, HttpResponseError } from "@ne1410s/http";
import { AccountOperation } from "../abstract/account";
import { IUpsertOrderRequest, IUpsertOrderPayload } from "../../interfaces/order/upsert";
import { IOrderResponse } from "../../interfaces/order/base";

export class UpsertOrderOperation extends AccountOperation<IUpsertOrderRequest, IOrderResponse, IUpsertOrderPayload> {
    
    constructor (baseUrl: string) {
        
        super(baseUrl, '/new-order');
    }

    validateRequest(requestData: IUpsertOrderRequest): void {

        super.validateRequest(requestData);

        const messages: string[] = [];

        if (!requestData.domains || requestData.domains.length == 0) {
            messages.push('At least one email is required');
        }

        if (requestData.startsOn || requestData.endsOn) {
            messages.push('Start and end dates are not currently implemented');
        }
        
        if (messages.length !== 0) {
            throw new ValidationError('The request is invalid', requestData, messages);
        }
    }

    protected toPayload(requestData: IUpsertOrderRequest): IUpsertOrderPayload {
        return {
            // TODO: Map start & end dates to iso strings
            identifiers: requestData.domains.map(domain => ({
                type: 'dns',
                value: domain
            }))
        }
    }

    async deserialise(response: Response, requestData: IUpsertOrderRequest): Promise<IOrderResponse> {
        
        const responseText = await response.text();

        if (!response.ok) {
            throw new HttpResponseError(response.status, response.statusText, response.headers, responseText);
        }      

        const json = JSON.parse(responseText),
              location = response.headers.get('location') || '',
              locParts = location.split('/');

        return {
            id: parseInt(locParts[locParts.length - 1], 10),
            status: json.status,
            orderUrl: location,
            expires: json.expires,
            authorizations: json.authorizations,
            finalize: json.finalize,
            identifiers: json.identifiers,
            token: response.headers.get('replay-nonce'),
        };
    }
        
    validateResponse(responseData: IOrderResponse): void {
        
        super.validateResponse(responseData);
        
        const messages: string[] = [];

        if (!responseData.id) {
            messages.push('Id is expected');
        }

        if (!responseData.orderUrl || responseData.orderUrl == '') {
            messages.push('Order url is expected');
        }

        if (!responseData.status || responseData.status == '') {
            messages.push('Status is expected');
        }

        if (!responseData.authorizations || responseData.authorizations.length == 0) {
            messages.push('At least one authorization url is expected');
        }

        if (!responseData.finalize || responseData.finalize == '') {
            messages.push('Finalize url is expected');
        }

        if (messages.length !== 0) {
            throw new ValidationError('The response is invalid', responseData, messages);
        }
    }
}