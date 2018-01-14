require('../../../lib/init');
const mocha = require('mocha');
const should = require('should');
const Spider = require(_base + 'service/laosiji/Spider');
const middleware = require(_base + 'middleware');

describe('Spider ',function() {
    before(function (done) {
        middleware.mongoConnector(_config.get('mongodb'))({}, function(error) {
            done(error);
        });
    });

    after(function (done) {
        // process.exit(0);
        done();
    });

    describe(' resolveConditions ', function () {
        it('should be ok', function(done) {
            let spider = new Spider();
            spider.crawl().then(res => {
                done();
            }).catch(done);
        })
    });
});
