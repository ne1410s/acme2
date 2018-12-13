const Chai = require('chai');
const Acme2 = require('../dist/index');

const sut = new Acme2('staging');
const RUN_CACHE = { id: null, token: null, keys: null };

describe('#acme tokens', () => {

    it('should add an order', async () => {

        // token
        var tokenResult = await sut.tokens.get.invoke();

        // account
        var accountRequest = { 
            termsAgreed: true,
            emails: ['test@test.com'],
            token: tokenResult.token
        };
        var accountResult = await sut.accounts.create.invoke(accountRequest);
        RUN_CACHE.id = accountResult.id;
        RUN_CACHE.token = accountResult.token;
        RUN_CACHE.keys = accountResult.keys;

        // order
        var orderRequest = {
            domains: ['test.biz'],
            id: RUN_CACHE.id,
            token: RUN_CACHE.token,
            keys: RUN_CACHE.keys
        };
        try {
            var result = await sut.orders.upsert.invoke(orderRequest);
            console.log('result ->', result);

        } catch (err) {
            console.log('error ->', err);
            throw new Chai.AssertionError('An error occurred');
        }        
    });

    it('should ...', async () => {

    });
});