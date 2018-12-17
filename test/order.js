/* const Chai = require('chai');
const Acme2 = require('../dist/index');

const sut = new Acme2('staging');
const RUN_CACHE = { accountId: null, token: null, keys: null };

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
        RUN_CACHE.accountId = accountResult.accountId;
        RUN_CACHE.token = accountResult.token;
        RUN_CACHE.keys = accountResult.keys;

        // order
        var orderRequest = {
            domains: ['test.biz'],
            accountId: RUN_CACHE.accountId,
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

    it('should get an order', async () => {

        var request = {
            accountId: 7571668,
            orderId: 16187123
        };
        try {
            var result = await sut.orders.get.invoke(request);
            console.log('result ->', result);

        } catch (err) {
            console.log('error ->', err);
            throw new Chai.AssertionError('An error occurred');
        }  
    });

    it('should finalise an order', async () => {

        var tokenResponse = await sut.tokens.get.invoke();

        var request = {
            accountId: 7606531,
            orderId: 16589829,
            token: tokenResponse.token,
            keys: {
                privateJwk: { alg: "RS256", d: "CWvwQiqN8JRr__tE9Bx0UYtswD-gsll2-l5qY-DcLXBxmjPEyZcUpTrb8kzhXgMTXOmxVV_sehT6PKTb5r2veoLQnPdsuwBninV_QUVQlDfuWdKp-8R8G1amaHkhD1sNe0lz8AlUqAt6_jx8aLikvXi5Nq4X96NG37OrGUa_D716gD3xu6lrfTBt8ShOVivZxTdUP2TmWF4SMpqWBH0E5FTNiJc9p7OISIQK_3MsFt4KrgWNs_C89O0IrWhY92dt6MIN8dMSftrEzXGOvMUBtQFnFn5gk5a5AZzNpPrCbZVgdDhLFsVqJMpNeLo6Q3LuK37DvCriHmBbdoZxaCrooQ", dp: "a7CO2ktiYpAqZNLOEKKZ_vVD573r9WQiZEjJWFvd9Vpd-cSND_Kcnx3rRsQSNBsOuy06Nb7vLs8mH6LGkrfYBZrQPFB3oV3X3riPJvDDyt6DBraNheVRkWz6HWhcgK2-v26kQ8SzuOjvtOiHneEVS6z37oNETWwbkTFrv2fsTgE", dq: "DYP6jSzIhVF-nMf1is6D2NYTnbDvRFhaU0uvXc-DQlOxSYfPW43EHxpQkSN4l4U5LvR8VrDq1V7dWHFNZVTd999jwo_7QgOEe_RZ5-8LaAKD-rJ65UhrMBJQPah4ZocBOu5ZT4MeAjxCMgsQrQOPGTbpkU_RHWd1uyGj-PKJcsc", e: "AQAB", ext: true, key_ops: ["sign"], kty: "RSA", n: "h2yKk1Fj65U97JajLuCN03Ye6xtP7FuX5SC_eeFKfsHur98nWcyG4Z__1yv43QR8FUhbzaapnnFgsOxLjP0e63BT-59pNuQKmqEuOT7Km0YTIdRAQX49BXXr6A48KP5HRNwpvoxZWaVE9ce4pkC06RcWLCX9y5Knw7ql2oqlCrtellSDK_sX_50I2G0-cbyahuLiMkUY8iymYycGj58IIh770rpVfCozs25zxIv2p-wgKTKFYFQZn7zudRHfQ38yZTdvEyk9T59btyJPxDxq91uL1zJKNunqUuSreWhC0z7PMV5yKg1mkIJc9vC9qTKRV-4ZYSz3-qTXIcACOd0C6w", p: "vWVqzirYak8CrBztqtFbkqBH3bfPG-t_rFGnMZvoYDxeOn5z_q3B6HCgu6BSmtsyYq3Raj53r4c7yYqmWCTJWl9W4m_Qavz8WV3bEGCVBPZQDncSHLVOhzCNpXG5Rk7q4FNX84fpHt03DegDj7kf2qSuvT8czakBoVbsqPhGt-E", q: "tww5aI4VKrGlcZ0xgVohFVDp0jb26lekxpmqsWEHWFilVdCKJnemiIObPinio1swoLQLzox8jNApBDaxk-ERO5aYyGJ_LgOfsA3adB7cWI5qZnIJ09ebTDUhsrFV6kcx_YtOxBU96m30zOi1JU8z1VxAjdrHTJTuM-sAuAZ5pEs", qi: "K4ZfT3OotqKVGVjOZ9zoLa0W5Lj5MV0zidCdfzLXqi1mFx1cG5MZRruyLFH-12yEupXQhw3DqZBXToTzxVc-761dhgexWc5PZs2HJ1SjZzPDTVmbmfSvXe-EY1MYfRw7Cv03lGVZ3HriO3iW10P3rWXaKbBkpJCxNh6GJSu80JU" },
                publicJwk: { alg: "RS256", e: "AQAB", ext: true, key_ops: [], kty: "RSA", n: "h2yKk1Fj65U97JajLuCN03Ye6xtP7FuX5SC_eeFKfsHur98nWcyG4Z__1yv43QR8FUhbzaapnnFgsOxLjP0e63BT-59pNuQKmqEuOT7Km0YTIdRAQX49BXXr6A48KP5HRNwpvoxZWaVE9ce4pkC06RcWLCX9y5Knw7ql2oqlCrtellSDK_sX_50I2G0-cbyahuLiMkUY8iymYycGj58IIh770rpVfCozs25zxIv2p-wgKTKFYFQZn7zudRHfQ38yZTdvEyk9T59btyJPxDxq91uL1zJKNunqUuSreWhC0z7PMV5yKg1mkIJc9vC9qTKRV-4ZYSz3-qTXIcACOd0C6w" }
            },
            identifiers: [
                // NB: The * was added to the below manually...  Must check if this was already delivered somehow in the pipeline....
                { type: 'dns', value: '*.gocarwarranty.co.uk' }
            ]
        };
        try {
            var result = await sut.orders.finalise.invoke(request);
            console.log('result ->', result);

        } catch (err) {
            console.log('error ->', err);
            throw new Chai.AssertionError('An error occurred');
        }  
    })
}); */