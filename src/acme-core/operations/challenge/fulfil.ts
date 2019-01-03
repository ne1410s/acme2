import { HttpResponseError, ValidationError } from "@ne1410s/http";
import { AccountOperation } from "../abstract/account";
import { IFulfilChallengePayload, IFulfilChallengeResponse, IFulfilChallengeRequest } from "../../interfaces/challenge/fulfil";

export class FulfilChallengeOperation extends AccountOperation<IFulfilChallengeRequest, IFulfilChallengeResponse, IFulfilChallengePayload> {
 
    constructor(baseUrl: string) {

        super(baseUrl, '/challenge/{authCode}/{id}');
    }

    validateRequest(requestData: IFulfilChallengeRequest): void {
        
        super.validateRequest(requestData);
        requestData.challengeDetail = requestData.challengeDetail || {} as any;

        const messages: string[] = [];

        if (!requestData.challengeDetail.fulfilmentData || !requestData.challengeDetail.fulfilmentData.keyAuth) {
            messages.push('Key auth is required');
        }

        if (!requestData.challengeDetail.authCode) {
            messages.push('Auth code is required');
        }

        if (!requestData.challengeDetail.challengeId) {
            messages.push('Challenge id is required');
        }

        if (messages.length !== 0) {
            throw new ValidationError('The request is invalid', requestData, messages);
        }

        // Once deemed valid; correct the operation url at invocation time
        this._url = `${this.baseUrl}/challenge/${requestData.challengeDetail.authCode}/${requestData.challengeDetail.challengeId}`;
    }

    
    protected async toPayload(requestData: IFulfilChallengeRequest): Promise<IFulfilChallengePayload> {
        return {
            keyAuthorization: requestData.challengeDetail.fulfilmentData.keyAuth
        };
    }

    async deserialise(response: Response, requestData: IFulfilChallengeRequest): Promise<IFulfilChallengeResponse> {
        
        const responseText = await response.text();

        if (!response.ok) {
            throw new HttpResponseError(response.status, response.statusText, response.headers, responseText);
        }

        const json = JSON.parse(responseText);
    
        return {
            status: json.status,
            type: json.type,
            url: json.url,
            token: response.headers.get('replay-nonce')
        }
    }
    
    validateResponse(responseData: IFulfilChallengeResponse): void {
        
        super.validateResponse(responseData);

        const messages: string[] = [];

        if (!responseData.status) {
            messages.push('Status is expected');
        }

        if (messages.length !== 0) {
            throw new ValidationError('The response is invalid', responseData, messages);
        }
    }
}