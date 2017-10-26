const should = require('should');
const app = require('../../../../server');
const agent = require('supertest')(app.callback());

describe('User model ',function(){
    before(function(done){
        done();
    });

    after(function(done){
        done();
    });

    describe('create user ', function () {
        it('get user should be ok ', function (done) {
            agent.get('/api/v1/users/1001')
                .set('content-type', 'application/json')
                .set('x-request-id', '8bf14a542d5847bbb880039a59bf23421')
                .end(function(err, res) {
                    should.not.exist(err);

                    res.statusCode.should.eql(200);

                    res.body.meta.code.should.eql(200);
                    res.body.response.userId.should.eql(1001);
                    done();
                });
        });
    });
});