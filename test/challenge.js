const Chai = require('chai');
const Acme2 = require('../dist/index');

const sut = new Acme2('staging');
let orig_response,
    deet_response;

describe('#acme challenges', () => {

    it('should list basic challenge data', async () => {

        var getOrderRequest = { accountId: 7604814, orderId: 16575435 };
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
            accountId: 7604814,
            token: tokenResponse.token,
            keys: {
                privateJwk: {"alg":"RS256","d":"Rxz3536cCj7Kt-6sthq-MAVanbK-X3aTHfW4qwGQg0J6K_HqsmBoPthqh-C-VoWOFbys0L0aSFWA7En7xksgF2H050HUGFRHT98EVOrtpNO8b7l9dNrAgROSRY7RnJMVtOgZpicoqyXLWv316pItRNl-LCDT6HHGkr-6Qd1UEDagz07uK3Bqu2RBdzwll1WAKH2NtLSo4tnKgFtozBTnK8xS2O2iDZMCp_uwAys2oNFPuIs7Bp5oLcTpWsE6Dm-sjq3je1ZKaccW_RhT1t9O8VvcnvKps-X92V8nOmx4YZ6BcHGq3iwopyDa1XuhT4B9MZIPwYDg0rGLYNrdiS08pQ","dp":"pzLh7_C55fjPAOCDd-3uUOAdtIZ551B2ENS_BoaSCPTKl8bHiIgfiN7elxK6_dB1y2wfF_n5AVvG-xOEjYETksnK0oQmjr4d9Zk6FPT-OU4NJ3xicwcPpTwLiFrotfVnY7QBdfIfoeW2XqxDzYVACrfxBQdgpGZ49sDAUCBLwo0","dq":"eVSjIA3KeVESEeieigafGujLjcDYKaXytJs-3MWFS1r2qw5M4qnl_ui2g0UFzoeUAGiDc5qbbBPTlM4MKS4DqHCmzIkD6OM7NzDrCTMIwCn3IGQKa2i0jbo9y4ATXe6ElrkhHjffmLOein7wLZ7kUTLvpBpzLqmduMQz6_qRjAU","e":"AQAB","ext":true,"key_ops":["sign"],"kty":"RSA","n":"lcb4NWX-AgGL4Tm5DBoMry9hmmoGGRelPhW3c2ZlLQ5OcwZDFA31VvZXHqLTQkPBayLTcOmtAhV1YQz-zAhLzyGSvskKnDY_MaZAcVTBrnSlis2-9504OALTJH4EP5oAjRgOf5GMkUMmZgC0748OcWapoeXc1uP1OgySNaEdoFaTjuzh0pSvdkLqHysY4mfNXjkesUoC_A9O94dRd8Gn94XD4r8Xog6WmkSCHpBEGx1y7S76a35mBRsfWhnzZF3lC3_E6H36cd5sIVgGULd6TJw5jUphWQaG5SyavSpzPLSWtR7oVrdDCTdSubAk1ZiZORroRSR5oKxwCtxBp_tn5w","p":"zxnQRK31j-XH0xjmbSRO_uYghGYkC4vTr7wbV9gYde9uXeQbrB6oDWKOQi0pd790K2Zr_mEj_B0cBzYtvM_m2-cFs318AMIP6ES-FRw-HewJ-Xw7BpPuweIQTDT-0F8NWYRp1cS1SRN7D9WWvoqeQR_2E4eb9cbp1huTCxos2ys","q":"uSQ8qKQ9iA8WpmYnmxUvQirlGm_8iK0e3HHqPnsZC6eIlhe186eGgTqnhv92yQi2J5G6lYPV9VN8zMpnB5OwkoMp2yywX1DtVwr2e0_8A3kq_uFirHs9gnOYoWYy7VMrt1bQiD2MMJX2jyVJjPe1X9XaGNgaCtdPP3YsEs1yGDU","qi":"uog5ZsPbLH1O8Dxz06m9eWuQGDcg223LoAnGLo1SkwQkiWhcyHnoB_A_u7Wmk9H3mLAJ0gg_uLJzfBcdjxiOO_IwRMtkR7xLk2ro3KwvvZZcPtCMKesW_vUh26Rjcu4Nskpmhor7SzvQ7V_6S4DEmBBxgTLef7tkK06HcmECUgI"},
                publicJwk: {"alg":"RS256","e":"AQAB","ext":true,"key_ops":[],"kty":"RSA","n":"lcb4NWX-AgGL4Tm5DBoMry9hmmoGGRelPhW3c2ZlLQ5OcwZDFA31VvZXHqLTQkPBayLTcOmtAhV1YQz-zAhLzyGSvskKnDY_MaZAcVTBrnSlis2-9504OALTJH4EP5oAjRgOf5GMkUMmZgC0748OcWapoeXc1uP1OgySNaEdoFaTjuzh0pSvdkLqHysY4mfNXjkesUoC_A9O94dRd8Gn94XD4r8Xog6WmkSCHpBEGx1y7S76a35mBRsfWhnzZF3lC3_E6H36cd5sIVgGULd6TJw5jUphWQaG5SyavSpzPLSWtR7oVrdDCTdSubAk1ZiZORroRSR5oKxwCtxBp_tn5w"}
            }
        }

        try {
            var response = await sut.challenges.fulfil.invoke(fulfil_request);
            console.log(response);

        } catch (err) {
            console.log('error ->', err);
            throw new Chai.AssertionError('An error occurred');
        }
        
    });
});