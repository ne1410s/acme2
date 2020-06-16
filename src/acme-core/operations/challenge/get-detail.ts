import * as Crypto from "@ne1410s/crypto";
import { OperationBase, ValidationError } from "@ne1410s/http";
import { IGetChallengeDetailRequest, IGetChallengeDetailResponse } from "../../interfaces/challenge/get-detail";
import { IFulfilmentData, IChallenge, IChallengeDetail } from "../../interfaces/challenge/base";

export class GetChallengeDetailOperation extends OperationBase<IGetChallengeDetailRequest, IGetChallengeDetailResponse> {

    validateRequest(requestData: IGetChallengeDetailRequest): void {

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

    protected async invokeInternal(requestData: IGetChallengeDetailRequest): Promise<IGetChallengeDetailResponse> {

        const orig = requestData.listResponse,
              domain = orig.identifier.value,
              detailsArray = await Promise.all(orig.challenges.map(async challenge => {

                  const retVal = challenge as IChallengeDetail,
                        urlParts = challenge.url.split('/');

                  retVal.challengeId = urlParts[urlParts.length - 1];
                  retVal.authCode = requestData.listResponse.authCode;
                  retVal.fulfilmentData = await this.generateFulfilmentData(challenge, domain, requestData.publicJwk);

                  return retVal;
              }));

        return {
            domain: domain,
            wildcard: orig.wildcard,
            expires: orig.expires,
            detail: detailsArray.filter(d => d.fulfilmentData.implemented)
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

    validateResponse(responseData: IGetChallengeDetailResponse): void {
        
        const messages: string[] = [];
        responseData = responseData || {} as IGetChallengeDetailResponse;

        if (!responseData.detail || responseData.detail.length == 0) {
            messages.push('Challenge details are expected');
        }
        else {
            responseData.detail.forEach(d => {

                    const fdata = d.fulfilmentData || {} as IFulfilmentData;

                    if (!d.type || !d.type) {
                        messages.push('Challenge identifier type is expected');
                    }
                    else {

                        if (!fdata.content) {
                            messages.push(`Content is expected for: ${d.type} challenge`);
                        }

                        if (!fdata.keyAuth) {
                            messages.push(`Key auth is expected for: ${d.type} challenge`);
                        }
                
                        if (!fdata.title) {
                            messages.push(`Title is expected for: ${d.type} challenge`);
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