import { IOrderRequest, IOrderResponse } from "../../interfaces/order/base";
import { JsonOperation, ValidationError, HttpResponseError } from "@ne1410s/http";

export class GetOrderOperation extends JsonOperation<IOrderRequest, IOrderResponse> {
    
    constructor (private baseUrl: string) {

        super(`${baseUrl}/order/{accountId}/{orderId}`, 'get');
    }

    validateRequest(requestData: IOrderRequest): void {

        const messages: string[] = [];
        requestData = requestData || {} as IOrderRequest;

        if (!requestData.accountId) {
            messages.push('Account id is required');
        }

        if (!requestData.orderId) {
            messages.push('Order id is required');
        }
        
        if (messages.length !== 0) {
            throw new ValidationError('The request is invalid', requestData, messages);
        }

        // Once deemed valid; correct the operation url at invocation time
        this._url = `${this.baseUrl}/order/${requestData.accountId}/${requestData.orderId}`;
    }
    
    async deserialise(response: Response, requestData: IOrderRequest): Promise<IOrderResponse> {
        
        const responseText = await response.text();

        if (!response.ok) {
            throw new HttpResponseError(response.status, response.statusText, response.headers, responseText);
        }      

        const json = JSON.parse(responseText),
              location = response.headers.get('location') || '',
              locParts = location.split('/'),
              authzParts = (json.authorizations || '').split('/');

        return {
            id: requestData.orderId,
            status: json.status,
            orderUrl: this._url,
            expires: json.expires,
            authzKeys: json.authorizations,
            finalize: json.finalize,
            identifiers: json.identifiers
        };
    }
        
    validateResponse(responseData: IOrderResponse): void {
        
        const messages: string[] = [];
        responseData = responseData || {} as IOrderResponse;

        if (!responseData.id) {
            messages.push('Id is expected');
        }

        if (!responseData.orderUrl || responseData.orderUrl == '') {
            messages.push('Order url is expected');
        }

        if (!responseData.status || responseData.status == '') {
            messages.push('Status is expected');
        }

        if (!responseData.authzKeys || responseData.authzKeys.length == 0) {
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