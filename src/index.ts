import { TokenOperation } from "./operations/token";

export enum Acme2Environment {
    Staging = 'https://acme-staging-v02.api.letsencrypt.org/acme',
    Production = 'https://acme-v02.api.letsencrypt.org/acme'
}

export class Acme2Service {
    
    public readonly baseUrl: string;

    private readonly tokenOperation: TokenOperation;

    constructor(env: Acme2Environment) {
        this.baseUrl = env.valueOf();
        this.tokenOperation = new TokenOperation(`${this.baseUrl}/new-nonce`, 'head');
    }

    async getToken(): Promise<string> {
        return await this.tokenOperation.invoke();
    }
}