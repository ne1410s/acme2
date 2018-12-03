const expect = require('chai').expect;
const ne14 = {
    acme2: require('../dist/index')
};

describe('#client', () => {

    it('should do the basics', async () => {
        var sut = await ne14.acme2.test3();
        expect(sut).to.equal('play, oh play the floogle horn');
    });
});
