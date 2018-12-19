/* const Chai = require('chai');
const ne14 = require('../dist/index');

const sut = new ne14.Acme2('staging');
const RUN_CACHE = { accountId: null, token: null, keys: null };

describe('#acme tokens', () => {

    it('should get a token', async () => {

        var result = await sut.tokens.get.invoke();
        console.log('result ->', result);
        Chai.expect(result.token || '').to.not.be.empty;

        // Cache the token
        RUN_CACHE.token = result.token;
    });

    it('should create an account', async () => {

        var request = { 
            termsAgreed: true,
            emails: ['test@test.com'],
            token: RUN_CACHE.token
        };

        try {
            var result = await sut.accounts.create.invoke(request);
            console.log('result ->', result);

            // Cache the account data
            RUN_CACHE.accountId = result.accountId;
            RUN_CACHE.token = result.token;
            RUN_CACHE.keys = result.keys;

        } catch (err) {
            console.log('error ->', err);
            throw new Chai.AssertionError('An error occurred');
        }
    });
 
    it('should load account details', async () => {

        var request = { 
            accountId: RUN_CACHE.accountId,
            token: RUN_CACHE.token,
            keys: RUN_CACHE.keys
        };

        try {
            var result = await sut.accounts.get.invoke(request);
            console.log('result ->', result);

            // Cache the token
            RUN_CACHE.token = result.token;

        } catch (err) {
            console.log('error ->', err);
            throw new Chai.AssertionError('An error occurred');
        }
    });
 
    it('should update account details', async () => {

        var request = { 
            accountId: RUN_CACHE.accountId,
            token: RUN_CACHE.token,
            keys: RUN_CACHE.keys,
            emails: ['abc@xyz.com']
        };

        try {
            var result = await sut.accounts.update.invoke(request);
            console.log('result ->', result);

            // Cache the token
            RUN_CACHE.token = result.token;

        } catch (err) {
            console.log('error ->', err);
            throw new Chai.AssertionError('An error occurred');
        }
    });

    it('should delete accounts', async () => {

        var request = { 
            accountId: RUN_CACHE.accountId,
            token: RUN_CACHE.token,
            keys: RUN_CACHE.keys
        };

        try {
            var result = await sut.accounts.delete.invoke(request);
            console.log('result ->', result);

            // Cache the token
            RUN_CACHE.token = result.token;

        } catch (err) {
            console.log('error ->', err);
            throw new Chai.AssertionError('An error occurred');
        }
    });
});
 */