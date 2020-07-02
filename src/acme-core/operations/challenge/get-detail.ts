import * as Crypto from '@ne1410s/crypto';
import { OperationBase, ValidationError } from '@ne1410s/http';
import {
  GetChallengeDetailRequest,
  GetChallengeDetailResponse,
} from '../../web-models/challenge/get-detail';
import { FulfilmentData, Challenge, ChallengeDetail } from '../../web-models/challenge/base';

export class GetChallengeDetailOperation extends OperationBase<
  GetChallengeDetailRequest,
  GetChallengeDetailResponse
> {
  protected async invokeInternal(
    requestData: GetChallengeDetailRequest
  ): Promise<GetChallengeDetailResponse> {
    const orig = requestData.listResponse,
      domain = orig.identifier.value,
      detailsArray = await Promise.all(
        orig.challenges.map(async (challenge) => {
          const retVal = challenge as ChallengeDetail,
            urlParts = challenge.url.split('/');

          retVal.challengeId = urlParts[urlParts.length - 1];
          retVal.authCode = requestData.listResponse.authCode;
          retVal.fulfilmentData = await this.generateFulfilmentData(
            challenge,
            domain,
            requestData.publicJwk
          );

          return retVal;
        })
      );

    return {
      domain: domain,
      wildcard: orig.wildcard,
      expires: orig.expires,
      detail: detailsArray.filter((d) => d.fulfilmentData.implemented),
    };
  }

  private async generateFulfilmentData(
    challenge: Challenge,
    domain: string,
    publicJwk: JsonWebKey
  ): Promise<FulfilmentData> {
    const keyAuth = await this.generateKeyAuth(challenge.token, publicJwk),
      fdata = { keyAuth } as FulfilmentData;

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
          path: '/.well-known/acme-challenge/',
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
}
