import { ValidationError, JsonBodylessOperation } from "@ne1410s/http"
import { IToken } from "../interface";

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

        const messages: string[] = [];

        if (!/^[\w-]{43}$/gi.test(responseData.token)) {
            messages.push(`Bad token: '${responseData.token}'`);
        }

        if (messages.length !== 0) {
            throw new ValidationError('The response is invalid', responseData, messages);
        }
    }
}