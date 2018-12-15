const Chai = require('chai');
const Acme2 = require('../dist/index');

const sut = new Acme2('staging');

describe('#acme challenges', () => {

    it('should list challenges', async () => {

        var getOrderRequest = { accountId: 7571668, orderId: 16187123 };
        var getOrderResponse = await sut.orders.get.invoke(getOrderRequest);
        var authCode = getOrderResponse.authCodes[0];
        
        try {
            var result = await sut.challenges.list.invoke({ authCode });
            console.log('result ->', result);

        } catch (err) {
            console.log('error ->', err);
            throw new Chai.AssertionError('An error occurred');
        }  
    });
});