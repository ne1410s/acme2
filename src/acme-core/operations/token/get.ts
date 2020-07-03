import { JsonBodylessOperation } from '@ne1410s/http';
import { Token } from '../../web-models/token/base';

export class GetTokenOperation extends JsonBodylessOperation<Token> {
  constructor(baseUrl: string) {
    super(`${baseUrl}/new-nonce`, 'head', null, Token);
  }

  async deserialise(response: Response, requestData: any): Promise<Token> {
    await Promise.resolve();
    return {
      token: response.headers.get('replay-nonce'),
    };
  }
}
