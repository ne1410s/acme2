import { ValidationError, JsonBodylessOperation } from "@ne1410s/http"
import { IResponse } from "../interfaces/base";

export class GetTokenOperation extends JsonBodylessOperation<IResponse> {

    constructor(baseUrl: string) {

        super(`${baseUrl}/new-nonce`, 'head');
    }
    
    async deserialise(response: Response, requestData: any): Promise<IResponse> {

        await Promise.resolve();
        
        return {
            token: response.headers.get('replay-nonce')
        };
    }

    validateResponse(responseData: IResponse): void {

        const messages: string[] = [];

        if (!/^[\w-]{43}$/gi.test(responseData.token)) {
            messages.push(`Bad token: '${responseData.token}'`);
        }

        if (messages.length !== 0) {
            throw new ValidationError('The response is invalid', responseData, messages);
        }
    }
}