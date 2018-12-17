import Crypto from "@ne1410s/crypto";
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

        if (!requestData.publicJwk) {
            messages.push('Public key is required');
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

        json.challenges.forEach(async challenge => { 
            challenge.fulfilmentData = await this.generateFulfilmentData(
                challenge,
                requestData.publicJwk);
        });

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

    private async generateFulfilmentData(challenge: IChallenge, publicJwk: JsonWebKey): Promise<IFulfilmentData> {

        const keyAuth = await this.generateKeyAuth(challenge.token, publicJwk),
              fdata = { keyAuth } as IFulfilmentData;

        switch (challenge.type) {

            case 'dns-01':
                fdata.title = `_acme-challenge.SOMEDOMAIN`;
                break;
            
            case 'http-01':
                fdata.title = 'http name';
                break;
            
            case 'tls-alpn-01':
                fdata.title = 'tls name';
                break;
            
            default:
                throw new Error('Unrecognised challenge type: ' + challenge.type);
        }

        return fdata;
    }

    private async generateKeyAuth(challengeToken: string, publicJwk: JsonWebKey): Promise<string> {

        const keyBase = { e: publicJwk.e, kty: publicJwk.kty, n: publicJwk.n },
              keyBaseText = JSON.stringify(keyBase),
              keyBaseHash = await Crypto.digest(keyBaseText);
        
        return `${challengeToken}.${keyBaseHash}`;
    }
}