/**
 * Configuration for Acme v2.
 */
export class Config {

    /**
     * The current environment.
     */
    environment: Acme2Env = Acme2Env.Staging;

    /**
     * Gets a formatted account url for the current environment.
     * @param accountid The account id.
     */
    accountUrl(accountId: string|number): string {
        return `${this.environment.valueOf()}/acct/${accountId}`;
    }
}

/**
 * Available Acme v2 environments.
 */
export enum Acme2Env {

    /**
     * The staging environment.
     */
    Staging = "https://acme-staging-v02.api.letsencrypt.org/acme",

    /**
     * The production environment.
     */
    Production = "https://acme-v02.api.letsencrypt.org/acme"
}