const Chai = require('chai');
const Acme2 = require('../dist/index');

const sut = new Acme2('staging');
let token;

describe('#acme tokens', () => {

    it('should get a token', async () => {

        var result = await sut.token.invoke();
        console.log('result ->', result);
        Chai.expect(result.token || '').to.not.be.empty;
        token = result.token;
    });

    it('should create an account', async () => {

        var request = { 
            termsAgreed: true,
            emails: ['test@test.com'],
            token: token
        };

        try {
            var result = await sut.create.invoke(request);
            console.log('result ->', result);
        } catch (err) {
            console.log('error ->', err);
            throw new Chai.AssertionError('An error occurred');
        }
    });
});
