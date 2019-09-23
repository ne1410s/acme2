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

        // once deemed valid; correct the operation url at invocation time
        this._url = `${this.baseUrl}/order/${requestData.accountId}/${requestData.orderId}`;
    }

    async deserialise(response: Response, requestData: IOrderRequest): Promise<IOrderResponse> {

        const responseText: string = await response.text();

        if (!response.ok) {
            throw new HttpResponseError(response.status, response.statusText, response.headers, responseText);
        }

        const json: any = JSON.parse(responseText);

        return {
            orderId: requestData.orderId,
            status: json.status,
            orderUrl: this._url,
            certificateUrl: json.certificate, // (once finalised)
            expires: json.expires,
            finaliseUrl: json.finalize,
            identifiers: json.identifiers,
            authCodes: json.authorizations.map((authUrl: string) => {
                const authUrlParts = authUrl.split('/');
                return authUrlParts[authUrlParts.length - 1];
            })
        };
    }

    validateResponse(responseData: IOrderResponse): void {

        const messages: string[] = [];
        responseData = responseData || {} as IOrderResponse;

        if (!responseData.orderId) {
            messages.push('Id is expected');
        }

        if (!responseData.orderUrl || responseData.orderUrl == '') {
            messages.push('Order url is expected');
        }

        if (!responseData.status || responseData.status == '') {
            messages.push('Status is expected');
        }

        if (!responseData.authCodes || responseData.authCodes.length == 0) {
            messages.push('At least one authorization code is expected');
        }

        if (!responseData.expires) {
            messages.push('Expiry date is expected');
        }

        if (!responseData.finaliseUrl || responseData.finaliseUrl == '') {
            messages.push('Finalise url is expected');
        }

        if (messages.length !== 0) {
            throw new ValidationError('The response is invalid', responseData, messages);
        }
    }
}