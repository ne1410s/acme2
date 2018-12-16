import { JsonOperation, ValidationError, HttpResponseError } from "@ne1410s/http";
import { IChallengeRequest, IChallengeResponse, IChallenge } from "../../interfaces/challenge/base";
import { IFulfilmentData } from "../../interfaces/challenge/fulfil";

export class ListChallengesOperation extends JsonOperation<IChallengeRequest, IChallengeResponse> {
    
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

    async deserialise(response: Response, requestData: IChallengeRequest): Promise<IChallengeResponse> {
        
        const responseText = await response.text();

        if (!response.ok) {
            throw new HttpResponseError(response.status, response.statusText, response.headers, responseText);
        }      

        const json = JSON.parse(responseText) as IChallengeResponse;
        json.challenges.forEach(c => this.addFulfilmentData(c));

        return json;
    }
    
    validateResponse(responseData: IChallengeResponse): void {
        
        const messages: string[] = [];
        responseData = responseData || {} as IChallengeResponse;

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

    addFulfilmentData(challenge: IChallenge): void {

        const data: any = { keyAuth: 'lol' };

        switch (challenge.type) {

            case 'dns-01':
                data.name = 'dns name';
                break;
            
            case 'http-01':
                data.name = 'http name';
                break;
            
            case 'tls-alpn-01':
                data.name = 'tls name';
                break;
            
            default:
                throw new Error('Unsupported challenge');
        }

        challenge.fulfilmentData = data;
    }
}