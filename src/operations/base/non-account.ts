import Crypto from "@ne1410s/crypto";
import { IKeyPair_Jwk } from "@ne1410s/crypto/dist/interfaces";
import { ValidationError } from "@ne1410s/http";
import { PayloadOperation } from "./payload";
import { IToken } from "../../interface";

export abstract class NonAccountOperation<TRequest extends IToken, TResponse extends IToken> extends PayloadOperation<TRequest, TResponse> {

    protected keys: IKeyPair_Jwk;

    async invoke(requestData: TRequest): Promise<TResponse> {
        
        this.keys = await Crypto.gen();



        this.keys.publicJwk = {
            "alg":"RS256","e":"AQAB","ext":true,"key_ops":[],"kty":"RSA","n":"qo9WvbPMKBbPYLEav0RP4D9c-oqA1mGO3zIygEO8w6MUEm83wFf6hDCuhCIO3jQIn1GEk_sgoiOYwiXBVpeDNIU6R2YAOotUfBnIuTsTnnRShuzF2WytrWHl4pLxge7TafALsBtrJaUyBnwzu0iE3ZZ9HS9yrjJPSmrUiMEQwRp2PSwkbAfxmFuJpWvjQhcH8knd--_x2Az1o9gpRERdmsOVopUixgU2lXreRu9sr3EuSTAY746b95-GTpg7QTTxWxc4Hk5QdojBTmF0ADyLc34WRV6sBWqSeVhkV6T0t9zcg4gpbgUn9IIvRMF3a2sjfwcyblIrawLLPP5CHrBWTw"
        };
        this.keys.privateJwk = {
            "alg":"RS256","d":"SFIhOK0dez44zsoqCkIgEHktprrF6KFTYIa7bTHLv7TNlQd9v1xOyHCP_00lusibg1qgedL5QmcPpfs2YM47_zAixxWUMT7VIw4X05seNYkjWTzao9f2SNeDD7C5IRwwnvH_MrxdkYfbj25ozRfx5reh85cj7IM-pdJorlgXD5nDPBrwI2brTZh-xxKyjSHOR8wrZd-jVss146QqeBUJEist3lqBUpd_B98MGJXWxpvXD6JX-OaoNO0XcRGHw385Rad5v9_kIkVUAegoXXb1OU3qzWMhSZ9689YhUQhTITwGdyb_qwyuhbDCVweJmitPqm0IhMkD-k9ko3-N1RnXiQ","dp":"DYPGRPK8-UCH4m8ph-nKkD6cap0yLLKf9L9i-eS6l3wsGKcJ3UU5WxJTZwYBdZl68yZBpFIi27MWZxxgr2ZS8UKAEZo6lZgAriQDy9-8P43vr-TOcOjBD9BeRJVNthvd5YSFhmLjpaq5nv7Ng1jNtA1J11dyeOklOrm9dZmNFbE","dq":"ZMq8sw9990AzK9w_dCvyn7e1fb_ZfWDAMig8CXX1HZajBasuGW89eFlJDTqW9zZWFbiJJgZePnbbQYiNX0zLHqBdaENUUBFqFueqD7YN-5pux7tbHefUFs2Ceh6Co0GfYMMEZgtkxnd2XvS0WkZOBT51MgcEe25GaBcD7imYVsk","e":"AQAB","ext":true,"key_ops":["sign"],"kty":"RSA","n":"qo9WvbPMKBbPYLEav0RP4D9c-oqA1mGO3zIygEO8w6MUEm83wFf6hDCuhCIO3jQIn1GEk_sgoiOYwiXBVpeDNIU6R2YAOotUfBnIuTsTnnRShuzF2WytrWHl4pLxge7TafALsBtrJaUyBnwzu0iE3ZZ9HS9yrjJPSmrUiMEQwRp2PSwkbAfxmFuJpWvjQhcH8knd--_x2Az1o9gpRERdmsOVopUixgU2lXreRu9sr3EuSTAY746b95-GTpg7QTTxWxc4Hk5QdojBTmF0ADyLc34WRV6sBWqSeVhkV6T0t9zcg4gpbgUn9IIvRMF3a2sjfwcyblIrawLLPP5CHrBWTw","p":"7RNyEiiybo-zdT7Dowl9H9_6DdCi8G6Ax34P_CR8ub-PZ9IgFvYJ4zLgTEsiO_P6SYnr5NmSNzmz9CFszGc34sVvj8fTCX8POMjEPaNdsKniP-WSwXPNDuYapuQzNu0WkftGXcRjQjfdlSJLy868W8BESqQHsvRcXAYK6xnyyrM","q":"uCyp-anBb7ha4Jq2IMWelSMVS4MOf41SsHmc-DvyQ4yaNGCzGmBLMxx19gEzVTC7Jn2kxSr021zuOt7F_4e0XXFcYVz6wbNMtCrj29sJ9jXHK8TrnAlSX5IWwJTlu08Pu_PCkQHygkAERXURORsrCXfNTCHLHO1iPuD605Jaw_U","qi":"2mnyn4nhuYO1br2mdCmBy0-HuXZtMNjgTu9Rog-N4B0ckE32ejAep4yzm4_Wyl-w87vUO3H_Bcw1EzH9J0WbIjH5ZZddC8bMlM1rsRdyISAes8D4SPzs5F_dYPqW_0nsodYG-t4fMAevV6xIKoC6jRroOuBM7a6YyjCm9-g8Rvc"
        };
        


        return await super.invoke(requestData);
    }

    validateRequest(requestData: TRequest): void {
        
        const messages: string[] = [];

        if (!this.keys || !this.keys.privateJwk || !this.keys.publicJwk) {
            messages.push('Keys have not been generated correctly');
        }

        if (messages.length !== 0) {
            throw new ValidationError('The request is invalid', this.keys, messages);
        }
    }

    protected getExtraProtectedData(requestData: TRequest): any {

        return {
            jwk: this.keys.publicJwk
        };
    }

    protected getSecret(requestData: TRequest): JsonWebKey {
        
        return this.keys.privateJwk;
    }
}