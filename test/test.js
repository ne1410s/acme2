const Chai = require('chai');
const Acme2 = require('../dist/index');

const sut = new Acme2('staging');

const KEYS_7570242_STAGING = {
    publicJwk: { kty: 'RSA', key_ops: [Array], e: 'AQAB', n: 'v_gUnQvO3BIFFTZcUQKcgwFhf8BQk723IPBJRTURR6EHy9-3WpMOvZF5vZmaN1pXNSuhZPAup7zqncOhIoD0iF83jrIjpxjZxH4Jj431jD2BElJ13VVoSG3h-FP_AyLow1q2eybDTpP9R5dJWNfooseDxsUcHxrX20wDNEzgyTvBfq7NxJFQ0Ps-PlO3nSGUVSehKdlo_W6KN9XK_GM2GYXQBXFr4TJ-N19jTQCv3zHml7jlP-Ev70bH6ZkVjB5syBS8ri-UgZ0mRa039pB2MY5XWgNct-mwrLpajCVtxUkfYkGSQp11l_RxSWTPVjhDbMJjF_Pqv0iZmNuDFWJY_Q', alg: 'RS256', ext: true },
    privateJwk: { kty: 'RSA', key_ops: [Array], e: 'AQAB', n: 'v_gUnQvO3BIFFTZcUQKcgwFhf8BQk723IPBJRTURR6EHy9-3WpMOvZF5vZmaN1pXNSuhZPAup7zqncOhIoD0iF83jrIjpxjZxH4Jj431jD2BElJ13VVoSG3h-FP_AyLow1q2eybDTpP9R5dJWNfooseDxsUcHxrX20wDNEzgyTvBfq7NxJFQ0Ps-PlO3nSGUVSehKdlo_W6KN9XK_GM2GYXQBXFr4TJ-N19jTQCv3zHml7jlP-Ev70bH6ZkVjB5syBS8ri-UgZ0mRa039pB2MY5XWgNct-mwrLpajCVtxUkfYkGSQp11l_RxSWTPVjhDbMJjF_Pqv0iZmNuDFWJY_Q', d: 'PkVwEl2BNbwWsAHZQmIReSGaigFNYg95dxLbAbssJssip0yjwprPfkjRb-KCtw_0GAhWK1MKH1lV1eVewL2KFS6l7AD3Nb4G7glgepO3Ik3VL6dWGn0Y_d2_HnnI0DCjxrMHXL1_P18cGvwFS--FxD_qDDFmZOSlPrrSk0WY6U2KzRkWZMXL8vkDX8eMbPr9jWSb0VpEVKcmVdphTQj3Da1P11HvG6510hA65dSj-oKoEY8VG5fgdoYgFctFvm1vGMHckWlmrDZxYydfutiXKA-_Ke3ADJyvrFIOsRhhwc1A-nG0DiftDnOfooVNEwBrpZBT9s6zQCapYifVXAI4lQ', p: '_oiT9LTi8daL6zhN4JRD15Lrr5x9fe9ViJcgPTQj8qxzDyAi52zzx8JZbVpB8YRVR97fGnlS-f-ELMEg15HYG4UloB5_Zq2TMHXrAwqlRSnOuH6K09nxinRi2AY2prqgoGl1jn2tzPbs5J6bNg3z5fASKTUwSyaGs_8EksKnDC8', q: 'wRM5QoztYL053apDlrM7FIcnhJKrJWMk7ZPvpHPFAymV8cQ0wSZyc3MJJv6QVg7F5uMOVc3OEYp67-LjD1GTpQLPpFrrs48Svlz6QFvYSR5N5MCz3Zoaok_4reV_L7tyMHxrXCWb9uvZm73vWuzmFLSlza_qPcUGUyxEZ_AWxpM', dp: 'dlz00Lq9PlDSyBNqw6Cu27SKvSM8iC-fyuDcMRnqDZN7_fCnyo6z3pTWGS_7smAjeER_40O__lmAEX_N0fEUWdfU41zLSeg1pjdvjf6JVFxYsRrHXDThSc1Nmb9p8qaew3nHHPf8tm-tQbMv4jci0C6Pg3Ikfw3vXgydB9JU9Ck', dq: 'R6gd0UBCfWvdRRKDATRF0gmTNhXFJRwVwYLtJui8jr7pYpBCUAk34vcnx2wlH3teIaHVWS0HtOTjWZKoWLAbDtvrOoFwBvUrrLEPQ8GSlRiFKkgGuVEPX3w0vD13pbx41dvncIyYxNylp7KnWeSgQ8ED5EHMut4bydSdEsI9gbc', qi: '3o5Mb_HLLdm80zWAHmIWfmyt-DKxdg2Tt2HF-V5xdDmHsEFzhoSUtMLFvugb22rV-2rpyJW4P7KSHVhFcWKXkKSrPYN1KEMWmZPOkpksZVjrpIU1_95m7UyHHuU89-HOwoInnn8YmssvmJZ7N31TT6_uG_qaa3XEQU66FUvFJNI', alg: 'RS256', ext: true }
};

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
 
    it('should load account details', async () => {

        var request = { 
            id: 7570242,
            token: token,
            keys: KEYS_7570242_STAGING
        };

        try {
            var result = await sut.get.invoke(request);
            console.log('result ->', result);
        } catch (err) {
            console.log('error ->', err);
            throw new Chai.AssertionError('An error occurred');
        }
    });
 
    it('should update account details', async () => {

        var request = { 
            id: 7570242,
            token: token,
            keys: KEYS_7570242_STAGING,
            emails: ['abc@xyz.com']
        };

        try {
            var result = await sut.update.invoke(request);
            console.log('result ->', result);
        } catch (err) {
            console.log('error ->', err);
            throw new Chai.AssertionError('An error occurred');
        }
    });

    it('should delete accounts', async () => {

        var request = { 
            id: 7570242,
            token: token,
            keys: KEYS_7570242_STAGING
        };

        try {
            var result = await sut.delete.invoke(request);
            console.log('result ->', result);
        } catch (err) {
            console.log('error ->', err);
            throw new Chai.AssertionError('An error occurred');
        }
    });
});
