import { AccountOperation } from "../base/account";
import { IAccountRequest } from "../../interfaces/account/base";
import { HttpResponseError, ValidationError } from "@ne1410s/http";
import { IDeleteAccountResponse } from "../../interfaces/account/delete";

export class DeleteAccountOperation extends AccountOperation<IAccountRequest, IDeleteAccountResponse, any> {
    
    constructor (baseUrl: string) {
        
        super(baseUrl, '/acct/{id}');
    }

    validateRequest(requestData: IAccountRequest): void {

        // Once deemed valid; correct the operation url at invocation time
        this._url = this.getAccountUrl(requestData);
    }

    protected toPayload(requestData: IAccountRequest): any {
        return {
            status: 'deactivated'
        };
    }

    async deserialise(response: Response, requestData: IAccountRequest): Promise<IDeleteAccountResponse> {
        
        const responseText = await response.text();

        if (!response.ok) {
            throw new HttpResponseError(response.status, response.statusText, response.headers, responseText);
        }      

        const json = JSON.parse(responseText);
        return {
            status: json.status,
            token: response.headers.get('replay-nonce')
        };
    }

    validateResponse(responseData: IDeleteAccountResponse): void {
        
        super.validateResponse(responseData);
        
        const messages: string[] = [];

        if (responseData.status !== 'deactivated') {
            messages.push('Unexpected status: ' + responseData.status);
        }

        if (messages.length !== 0) {
            throw new ValidationError('The response is invalid', responseData, messages);
        }
    }
}