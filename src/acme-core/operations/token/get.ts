import { ValidationError, JsonBodylessOperation } from '@ne1410s/http';
import { Token } from '../../web-models/token/base';

export class GetTokenOperation extends JsonBodylessOperation<Token> {
  constructor(baseUrl: string) {
    super(`${baseUrl}/new-nonce`, 'head');
  }

  async deserialise(response: Response, requestData: any): Promise<Token> {
    await Promise.resolve();

    return {
      token: response.headers.get('replay-nonce'),
    };
  }

  validateResponse(responseData: Token): void {
    const messages: string[] = [];

    if (!/^[\w-]{43,}$/gi.test(responseData.token)) {
      messages.push(`Unexpected token format: '${responseData.token}'`);
    }

    if (messages.length !== 0) {
      throw new ValidationError('The response is invalid', responseData, messages);
    }
  }
}

//TODO!!!
