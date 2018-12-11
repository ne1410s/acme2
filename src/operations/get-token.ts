import { ValidationError, JsonBodylessOperation } from "@ne1410s/http"
import { IToken } from "../requests/account";

export class GetTokenOperation extends JsonBodylessOperation<IToken> {

    constructor(baseUrl: string) {
        super(`${baseUrl}/new-nonce`, 'head');
    }
    
    async deserialise(response: Response): Promise<IToken> {

        await Promise.resolve();
        
        return {
            token: response.headers.get('replay-nonce')
        };
    }

    validateResponse(responseData: IToken): void {

        if (!/^[\w-]{43}$/gi.test(responseData.token)) {
            throw new ValidationError(responseData);
        }
    }
}