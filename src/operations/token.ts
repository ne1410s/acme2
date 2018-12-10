import { DeserialisationError, ValidationError, JsonBodylessOperation } from "@ne1410s/http"

export class TokenOperation extends JsonBodylessOperation<string> {
    
    async deserialise(response: Response): Promise<string> {

        await Promise.resolve();

        if (!response.headers.has('replay-nonce')) {
            throw new DeserialisationError();
        }
        
        return response.headers.get('replay-nonce');
    }

    validateResponse(responseData: string): void {

        if (!/^[\w-]{43}$/gi.test(responseData)) {
            throw new ValidationError(responseData);
        }
    }
}