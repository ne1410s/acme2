import Crypto from "@ne1410s/crypto";
import { OperationBase, ValidationError } from "@ne1410s/http";
import { IGetFulfilmentDataRequest, IGetFulfilmentDataResponse } from "../../interfaces/challenge/get-fulfilment-data";
import { IFulfilmentData, IChallenge, IChallengeDetails } from "../../interfaces/challenge/base";

export class GetFulfilmentDataOperation extends OperationBase<IGetFulfilmentDataRequest, IGetFulfilmentDataResponse> {
    
    validateRequest(requestData: IGetFulfilmentDataRequest): void {
        
        const messages: string[] = [];

        if (!requestData.listResponse) {
            messages.push('At least one email is required');
        }

        if (!requestData.publicJwk) {
            messages.push('Public key is required');
        }

        if (messages.length !== 0) {
            throw new ValidationError('The request is invalid', requestData, messages);
        }
    }
       
    protected async invokeInternal(requestData: IGetFulfilmentDataRequest): Promise<IGetFulfilmentDataResponse> {
        
        const orig = requestData.listResponse,
              domain = orig.identifier.value,
              fDataArray = await Promise.all(orig.challenges.map(async chal =>
                    await this.generateFulfilmentData(chal, domain, requestData.publicJwk)));

        return {
            detailedChallenges: fDataArray
                .filter(fdata => fdata.implemented)
                .map(fdata => ({
                    expires: orig.expires,
                    identifier: orig.identifier,
                    status: orig.status,
                    fulfilmentData: fdata,
                    wildcard: orig.wildcard
                }) as IChallengeDetails)
        };
    }

    private async generateFulfilmentData(challenge: IChallenge, domain: string, publicJwk: JsonWebKey): Promise<IFulfilmentData> {

        const keyAuth = await this.generateKeyAuth(challenge.token, publicJwk),
              fdata = { keyAuth } as IFulfilmentData;

        switch (challenge.type) {

            case 'dns-01':
                fdata.implemented = true;
                fdata.title = `_acme-challenge.${domain}`;
                fdata.content = await Crypto.digest(keyAuth);
                break;
            
            case 'http-01':
                fdata.implemented = true;
                fdata.title = challenge.token;
                fdata.content = keyAuth;
                fdata.more = {
                    url: `http://${domain}:80/.well-known/acme-challenge/${challenge.token}`,
                    host: `http://${domain}:80`,
                    path: '/.well-known/acme-challenge/'
                };
                break;
            
            case 'tls-alpn-01':
                fdata.implemented = false;
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

    validateResponse(responseData: IGetFulfilmentDataResponse): void {
        
        const messages: string[] = [];
        responseData = responseData || {} as IGetFulfilmentDataResponse;

        if (!responseData.detailedChallenges || responseData.detailedChallenges.length == 0) {
            messages.push('Challenge details are expected');
        }
        else {
            responseData.detailedChallenges.forEach(dc => {

                    const fdata = dc.fulfilmentData || {} as IFulfilmentData;

                    if (!dc.type || dc.type.length == 0) {
                        messages.push('Challenge type is expected')
                    }
                    else {

                        if (!fdata.content) {
                            messages.push(`Content is expected for: ${dc.type} challenge`);
                        }

                        if (!fdata.keyAuth) {
                            messages.push(`Key auth is expected for: ${dc.type} challenge`);
                        }
                
                        if (!fdata.title) {
                            messages.push(`Title is expected for: ${dc.type} challenge`);
                        }
                    }
                }
            );
        }

        if (messages.length !== 0) {
            throw new ValidationError('The response is invalid', responseData, messages);
        }
    }
}