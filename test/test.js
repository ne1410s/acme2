const expect = require('chai').expect;
const fetch = require('node-fetch');
global.Headers = fetch.Headers;

const ne14 = {
    acme2: require('../dist/index')
};

describe('#acme tokens', () => {

    it('should provide a token', async () => {

        var env = ne14.acme2.Acme2Environment.Staging;
        var sut = new ne14.acme2.Acme2Service(env);
        var result = await sut.getToken() || '';

        console.log('result ->', result);
        expect(result).to.not.be.empty;
    });
});
