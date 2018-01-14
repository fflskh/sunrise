require('../../../lib/init');
const mocha = require('mocha');
const should = require('should');
const Pipeline = require(_base + 'service/laosiji/Pipeline');
const middleware = require(_base + 'middleware');

describe('Spider ',function() {
    before(function (done) {
        middleware.mongoConnector(_config.get('mongodb'))({}, function(error) {
            done(error);
        });
    });

    after(function (done) {
        done();
    });

    describe(' resolveConditions ', function () {
        it('should be ok', function(done) {
            let pipeline = new Pipeline();
            pipeline.count({
                modelName: 'Series',
                where: {}
            }).then(count => {
                console.log('count : ', count);
                done();
            }).catch(done);
        })
    });
});
