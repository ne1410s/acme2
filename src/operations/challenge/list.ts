import { JsonOperation, ValidationError, HttpResponseError } from "@ne1410s/http";
import { IChallengeRequest } from "../../interfaces/challenge/base";
import { IChallengeListResponse } from "../../interfaces/challenge/list";

export class ListChallengesOperation extends JsonOperation<IChallengeRequest, IChallengeListResponse> {
    
    constructor (private baseUrl: string) {

        super(`${baseUrl}/authz/{authCode}`, 'get');
    }

    validateRequest(requestData: IChallengeRequest): void {
        
        const messages: string[] = [];
        requestData = requestData || {} as IChallengeRequest;

        if (!requestData.authCode) {
            messages.push('Authorization code is required');
        }

        if (messages.length !== 0) {
            throw new ValidationError('The request is invalid', requestData, messages);
        }

        // Once deemed valid; correct the operation url at invocation time
        this._url = `${this.baseUrl}/authz/${requestData.authCode}`;
    }

    async deserialise(response: Response, requestData: IChallengeRequest): Promise<IChallengeListResponse> {
        
        const responseText = await response.text();

        if (!response.ok) {
            throw new HttpResponseError(response.status, response.statusText, response.headers, responseText);
        }      

        const json = JSON.parse(responseText);

        return json as IChallengeListResponse;
    }
    
    validateResponse(responseData: IChallengeListResponse): void {
        
        const messages: string[] = [];
        responseData = responseData || {} as IChallengeListResponse;

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