
export default abstract class Config {

    static hostName = 'localhost';

    static portNumber = 3000;

    static useProductionApi = false;

    static get apiEnvironment(): any {
        return Config.useProductionApi ? 'production' : 'staging';
    }
};