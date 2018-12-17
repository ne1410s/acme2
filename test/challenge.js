const Chai = require('chai');
const Acme2 = require('../dist/index');

const sut = new Acme2('staging');
let orig_response;

describe('#acme challenges', () => {

    it('should list basic challenge data', async () => {

        var getOrderRequest = { accountId: 7571668, orderId: 16187123 };
        var getOrderResponse = await sut.orders.get.invoke(getOrderRequest);
        var authCode = getOrderResponse.authCodes[0];
        
        try {
            orig_response = await sut.challenges.list.invoke({ authCode });
            console.log(orig_response);

        } catch (err) {
            console.log('error ->', err);
            throw new Chai.AssertionError('An error occurred');
        }
    });

    it('should list further details for fulfilment', async () => {
        
        try {
            var result = await sut.challenges.detail.invoke({
                listResponse: orig_response,
                publicJwk: { e: 'some', kty: 'fake', n: 'data' }
            });
            //console.log(result);
            result.detail.forEach(r => console.log(r.fulfilmentData));

        } catch (err) {
            console.log('error ->', err);
            throw new Chai.AssertionError('An error occurred');
        }
    });
});