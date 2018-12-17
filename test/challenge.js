/* const Chai = require('chai');
const Acme2 = require('../dist/index');

const sut = new Acme2('staging');
let orig_response,
    deet_response;

describe('#acme challenges', () => {

    it('should list basic challenge data', async () => {

        var getOrderRequest = { accountId: 7606531, orderId: 16589829 };
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
            deet_response = await sut.challenges.detail.invoke({
                listResponse: orig_response,
                publicJwk: { e: 'AQAB', kty: 'RSA', n: 'lcb4NWX-AgGL4Tm5DBoMry9hmmoGGRelPhW3c2ZlLQ5OcwZDFA31VvZXHqLTQkPBayLTcOmtAhV1YQz-zAhLzyGSvskKnDY_MaZAcVTBrnSlis2-9504OALTJH4EP5oAjRgOf5GMkUMmZgC0748OcWapoeXc1uP1OgySNaEdoFaTjuzh0pSvdkLqHysY4mfNXjkesUoC_A9O94dRd8Gn94XD4r8Xog6WmkSCHpBEGx1y7S76a35mBRsfWhnzZF3lC3_E6H36cd5sIVgGULd6TJw5jUphWQaG5SyavSpzPLSWtR7oVrdDCTdSubAk1ZiZORroRSR5oKxwCtxBp_tn5w' }
            });
            deet_response.detail.forEach(r => console.log(r.fulfilmentData));

        } catch (err) {
            console.log('error ->', err);
            throw new Chai.AssertionError('An error occurred');
        }
    });

    it('should (attempt to) fulfil a challenge', async () => {

        var tokenResponse = await sut.tokens.get.invoke();
    
        var fulfil_request = {
            challengeDetail: deet_response.detail[0],
            accountId: 7606531,
            token: tokenResponse.token,
            keys: {
                privateJwk: { alg: "RS256", d: "CWvwQiqN8JRr__tE9Bx0UYtswD-gsll2-l5qY-DcLXBxmjPEyZcUpTrb8kzhXgMTXOmxVV_sehT6PKTb5r2veoLQnPdsuwBninV_QUVQlDfuWdKp-8R8G1amaHkhD1sNe0lz8AlUqAt6_jx8aLikvXi5Nq4X96NG37OrGUa_D716gD3xu6lrfTBt8ShOVivZxTdUP2TmWF4SMpqWBH0E5FTNiJc9p7OISIQK_3MsFt4KrgWNs_C89O0IrWhY92dt6MIN8dMSftrEzXGOvMUBtQFnFn5gk5a5AZzNpPrCbZVgdDhLFsVqJMpNeLo6Q3LuK37DvCriHmBbdoZxaCrooQ", dp: "a7CO2ktiYpAqZNLOEKKZ_vVD573r9WQiZEjJWFvd9Vpd-cSND_Kcnx3rRsQSNBsOuy06Nb7vLs8mH6LGkrfYBZrQPFB3oV3X3riPJvDDyt6DBraNheVRkWz6HWhcgK2-v26kQ8SzuOjvtOiHneEVS6z37oNETWwbkTFrv2fsTgE", dq: "DYP6jSzIhVF-nMf1is6D2NYTnbDvRFhaU0uvXc-DQlOxSYfPW43EHxpQkSN4l4U5LvR8VrDq1V7dWHFNZVTd999jwo_7QgOEe_RZ5-8LaAKD-rJ65UhrMBJQPah4ZocBOu5ZT4MeAjxCMgsQrQOPGTbpkU_RHWd1uyGj-PKJcsc", e: "AQAB", ext: true, key_ops: ["sign"], kty: "RSA", n: "h2yKk1Fj65U97JajLuCN03Ye6xtP7FuX5SC_eeFKfsHur98nWcyG4Z__1yv43QR8FUhbzaapnnFgsOxLjP0e63BT-59pNuQKmqEuOT7Km0YTIdRAQX49BXXr6A48KP5HRNwpvoxZWaVE9ce4pkC06RcWLCX9y5Knw7ql2oqlCrtellSDK_sX_50I2G0-cbyahuLiMkUY8iymYycGj58IIh770rpVfCozs25zxIv2p-wgKTKFYFQZn7zudRHfQ38yZTdvEyk9T59btyJPxDxq91uL1zJKNunqUuSreWhC0z7PMV5yKg1mkIJc9vC9qTKRV-4ZYSz3-qTXIcACOd0C6w", p: "vWVqzirYak8CrBztqtFbkqBH3bfPG-t_rFGnMZvoYDxeOn5z_q3B6HCgu6BSmtsyYq3Raj53r4c7yYqmWCTJWl9W4m_Qavz8WV3bEGCVBPZQDncSHLVOhzCNpXG5Rk7q4FNX84fpHt03DegDj7kf2qSuvT8czakBoVbsqPhGt-E", q: "tww5aI4VKrGlcZ0xgVohFVDp0jb26lekxpmqsWEHWFilVdCKJnemiIObPinio1swoLQLzox8jNApBDaxk-ERO5aYyGJ_LgOfsA3adB7cWI5qZnIJ09ebTDUhsrFV6kcx_YtOxBU96m30zOi1JU8z1VxAjdrHTJTuM-sAuAZ5pEs", qi: "K4ZfT3OotqKVGVjOZ9zoLa0W5Lj5MV0zidCdfzLXqi1mFx1cG5MZRruyLFH-12yEupXQhw3DqZBXToTzxVc-761dhgexWc5PZs2HJ1SjZzPDTVmbmfSvXe-EY1MYfRw7Cv03lGVZ3HriO3iW10P3rWXaKbBkpJCxNh6GJSu80JU" },
                publicJwk: { alg: "RS256", e: "AQAB", ext: true, key_ops: [], kty: "RSA", n: "h2yKk1Fj65U97JajLuCN03Ye6xtP7FuX5SC_eeFKfsHur98nWcyG4Z__1yv43QR8FUhbzaapnnFgsOxLjP0e63BT-59pNuQKmqEuOT7Km0YTIdRAQX49BXXr6A48KP5HRNwpvoxZWaVE9ce4pkC06RcWLCX9y5Knw7ql2oqlCrtellSDK_sX_50I2G0-cbyahuLiMkUY8iymYycGj58IIh770rpVfCozs25zxIv2p-wgKTKFYFQZn7zudRHfQ38yZTdvEyk9T59btyJPxDxq91uL1zJKNunqUuSreWhC0z7PMV5yKg1mkIJc9vC9qTKRV-4ZYSz3-qTXIcACOd0C6w" }
            }
        };

        try {
            var response = await sut.challenges.fulfil.invoke(fulfil_request);
            console.log(response);

        } catch (err) {
            console.log('error ->', err);
            throw new Chai.AssertionError('An error occurred');
        }
        
    });
}); */