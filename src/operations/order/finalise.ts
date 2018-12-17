import Crypto from "@ne1410s/crypto";
import { ValidationError, HttpResponseError } from "@ne1410s/http";
import { AccountOperation } from "../abstract/account";
import { IFinaliseOrderRequest, IFinaliseOrderResponse, IFinaliseOrderPayload } from "../../interfaces/order/finalise";

export class FinaliseOrderOperation extends AccountOperation<IFinaliseOrderRequest, IFinaliseOrderResponse, IFinaliseOrderPayload> {
    
    constructor(baseUrl: string) {

        super(baseUrl, '/finalize/{accountId}/{orderId}');
    }

    validateRequest(requestData: IFinaliseOrderRequest): void {

        super.validateRequest(requestData);
        requestData.identifiers = requestData.identifiers || [];

        const messages: string[] = [];

        if (!requestData.orderId) {
            messages.push('Order id is required');
        }

        if (requestData.identifiers.length == 0) {
            messages.push('At least one identifier is required');
        }
                
        if (messages.length !== 0) {
            throw new ValidationError('The request is invalid', requestData, messages);
        }

        // Once deemed valid; correct the operation url at invocation time
        this._url = `${this.baseUrl}/finalize/${requestData.accountId}/${requestData.orderId}`;
    }

    protected async toPayload(requestData: IFinaliseOrderRequest): Promise<IFinaliseOrderPayload> {
        
        const domains = requestData.identifiers.map(i => i.value),
              csrObject = await Crypto.csr({ domains });

        return {
            csr: csrObject.der
        };
    }

    async deserialise(response: Response, requestData: IFinaliseOrderRequest): Promise<IFinaliseOrderResponse> {
        
        const responseText = await response.text();

        if (!response.ok) {
            throw new HttpResponseError(response.status, response.statusText, response.headers, responseText);
        }      

        const json = JSON.parse(responseText);

        return {
            status: json.status,
            expires: json.expires,
            certificateUrl: json.certificate,
            token: response.headers.get('replay-nonce')
        };
    }
        
    validateResponse(responseData: IFinaliseOrderResponse): void {
        
        super.validateResponse(responseData);
        
        const messages: string[] = [];

        if (!responseData.status) {
            messages.push('Status is expected');
        }

        if (!responseData.expires) {
            messages.push('Expiry data is expected');
        }

        if (responseData.status == 'valid' && !responseData.certificateUrl) {
            messages.push('Status is valid - certificate url is expected');
        }

        if (responseData.status != 'valid' && responseData.certificateUrl) {
            messages.push('Status is not valid - certificate url is not expected');
        }

        if (messages.length !== 0) {
            throw new ValidationError('The response is invalid', responseData, messages);
        }
    }

}