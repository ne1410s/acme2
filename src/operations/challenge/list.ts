import { HttpResponseError, JsonOperation, ValidationError } from "@ne1410s/http";
import {  } from "../../interfaces/challenge/base";
import { IListChallengesRequest, IListChallengesResponse } from "../../interfaces/challenge/list";

export class ListChallengesOperation extends JsonOperation<IListChallengesRequest, IListChallengesResponse> {
    
    constructor (private baseUrl: string) {

        super(`${baseUrl}/authz/{authCode}`, 'get');
    }

    validateRequest(requestData: IListChallengesRequest): void {
        
        const messages: string[] = [];
        requestData = requestData || {} as IListChallengesRequest;

        if (!requestData.authCode) {
            messages.push('Authorization code is required');
        }

        if (messages.length !== 0) {
            throw new ValidationError('The request is invalid', requestData, messages);
        }

        // Once deemed valid; correct the operation url at invocation time
        this._url = `${this.baseUrl}/authz/${requestData.authCode}`;
    }

    async deserialise(response: Response, requestData: IListChallengesRequest): Promise<IListChallengesResponse> {
        
        const responseText = await response.text();

        if (!response.ok) {
            throw new HttpResponseError(response.status, response.statusText, response.headers, responseText);
        }      

        const json = JSON.parse(responseText);

        return {
            challenges: json.challenges,
            expires: json.expires,
            identifier: json.identifier,
            status: json.status,
            wildcard: !!json.wildcard
        };
    }
    
    validateResponse(responseData: IListChallengesResponse): void {
        
        const messages: string[] = [];
        responseData = responseData || {} as IListChallengesResponse;

        if (!responseData.challenges || responseData.challenges.length == 0) {
            messages.push('At least one challenge is expected');
        }

        if (!responseData.expires) {
            messages.push('Expiry date is expected');
        }

        if (!responseData.status || responseData.status == '') {
            messages.push('Status is expected');
        }

        if (!responseData.identifier || !responseData.identifier.value) {
            messages.push('Domain identifier is expected');
        }

        if (messages.length !== 0) {
            throw new ValidationError('The response is invalid', responseData, messages);
        }
    }  
}