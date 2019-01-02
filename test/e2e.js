/* const expect = require('chai').expect;
const ne14 = require('../dist/services/acme2');

const SUT = new ne14.Acme2Service('staging'),
      CACHE = { token: '', aid: 0, keys: {}, oid: 0, authCodes: [], challengesList: {}, challengeDetail: {}, certificateUrl: '' },
      TEST_DETAILS = {
        emails: ['pgj646@gmail.com'],
        domain: '*.mydomain.co.uk'
      }

describe('#acme e2e', () => {

    it('should get-token', async () => {

        var result = await invokeOrLog('tokens', 'get'),
            token = result.token || '';

        expect(token).to.not.be.empty;

        CACHE.token = token;
    });

    it('should create-account', async () => {

        var params = { termsAgreed: true, emails: TEST_DETAILS.emails, token: CACHE.token },
            result = await invokeOrLog('accounts', 'create', params),
            aid = result.accountId || 0;

        expect(aid).to.not.equal(0);

        CACHE.token = result.token;
        CACHE.aid = aid;
        CACHE.keys = result.keys;
    });

    it('should update-account', async () => {

        var params = { emails: ['email1@temp.org', 'email2@temp.org'], accountId: CACHE.aid, keys: CACHE.keys, token: CACHE.token },
            result = await invokeOrLog('accounts', 'update', params);

        expect(result.contacts.length).to.equal(2);

        CACHE.token = result.token;
    });

    it('should get-account', async () => {
        
        var params = { accountId: CACHE.aid, keys: CACHE.keys, token: CACHE.token },
            result = await invokeOrLog('accounts', 'get', params);

        CACHE.token = result.token;
    });

    it('should delete-account', async () => {
        
        // Create fresh account
        var createParams = { termsAgreed: true, emails: ['test@fake.biz'], token: CACHE.token },
            createResult = await invokeOrLog('accounts', 'create', createParams);
        
        // Delete it
        var deleteParams = { accountId: createResult.accountId, keys: createResult.keys, token: createResult.token },
            deleteResult = await invokeOrLog('accounts', 'delete', deleteParams);

        expect(deleteResult.status).to.equal('deactivated');

        CACHE.token = deleteResult.token;
    });

    it('should create-order', async () => {

        var params = { domains: [TEST_DETAILS.domain], accountId: CACHE.aid, keys: CACHE.keys, token: CACHE.token },
            result = await invokeOrLog('orders', 'upsert', params),
            oid = result.orderId || 0;

        expect(oid).to.not.equal(0);

        CACHE.token = result.token;
        CACHE.oid = oid;
    });


    // CACHE.aid = xxx;
    // CACHE.oid = xxx;
    // CACHE.keys = { 
    //     xxx
    // };


    it('should get-order', async () => {

        // Tokens are not required nor emitted here
        var params = { accountId: CACHE.aid, orderId: CACHE.oid },
            result = await invokeOrLog('orders', 'get', params),
            authCodes = result.authCodes || [];

        expect(result.orderUrl).to.not.be.empty;
        expect(result.finaliseUrl).to.not.be.empty;
        expect(authCodes.length).to.not.equal(0);

        console.log(result);

        CACHE.authCodes = authCodes;
        CACHE.certificateUrl = result.certificateUrl;
    });

    it('should list-challenges', async () => {

        // Tokens are not required nor emitted here
        var params = { authCode: CACHE.authCodes[0] },
            result = await invokeOrLog('challenges', 'list', params),
            challenges = result.challenges || [],
            domain = (result.identifier || {}).value || '';

        expect(challenges.length).to.not.equal(0);
        expect(domain).to.not.be.empty;

        CACHE.challengesList = result;        
    });

    it('should get-challenge-details', async () => {

        // Tokens are not required nor emitted here
        var params = { publicJwk: CACHE.keys.publicJwk, listResponse: CACHE.challengesList },
            result = await invokeOrLog('challenges', 'detail', params),
            domain = result.domain || '',
            detail = result.detail || [];

        expect(domain).to.not.be.empty;
        expect(detail.length).to.not.equal(0);
        expect(detail[0].challengeId || 0).to.not.equal(0);

        CACHE.challengeDetail = detail[0];
    });

    it('should fulfil-challenge', async () => {

        // e2e: not expecting success here
        var params = { challengeDetail: CACHE.challengeDetail, accountId: CACHE.aid, keys: CACHE.keys, token: CACHE.token },
            result = await invokeOrLog('challenges', 'fulfil', params),
            url = result.url || '',
            status = result.status || '';

        expect(url).to.not.be.empty;
        expect(status).to.equal('pending', 'Status not expected to be anything other than pending this quick..');

        CACHE.token = result.token;
    });

    it('should finalise-order', async () => {
        
        // e2e: not expecting success here
        var params = { accountId: CACHE.aid, orderId: CACHE.oid, keys: CACHE.keys, token: CACHE.token, identifiers: [ { type: 'dns', value: TEST_DETAILS.domain } ] },
            result = await invokeOrLog('orders', 'finalise', params),
            status = result.status || '',
            certificateUrl = result.certificateUrl || '';

        console.log('\r\n\r\n--------------------------- CSR Private Key) ---------------------------\r\n', result.originalCsr.pkcs8);

        expect(status).to.not.be.empty;
        expect(certificateUrl).to.not.be.empty;

        CACHE.token = result.token;
        CACHE.certificateUrl = certificateUrl;
    });

    it('should download-order-cert', async () => {
        
        // e2e: not expecting success here
        var params = { certificateUrl: CACHE.certificateUrl },
            result = await invokeOrLog('orders', 'getCert', params);

        expect(result.content || '').to.not.be.empty;

        console.log(result);
    });

    it('should report final cache status', async () => {
        console.log(CACHE);
    });
});

async function invokeOrLog(entity, operation, params) {

    try {
        return await SUT[entity][operation].invoke(params);
    }
    catch (error) {
        console.log('-------------------------------------------------');
        console.log('An error occurred invoking ' + entity + '.' + operation);
        console.log('Params ->', params);
        console.log('Error ->', error);
        console.log('-------------------------------------------------');
        throw error;
    }
} */