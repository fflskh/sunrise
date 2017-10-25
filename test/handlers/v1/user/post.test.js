const should = require('should');
const app = require('../../../../server');
const agent = require('supertest')(app.callback());

let body;

describe('User model ',function(){
    before(function(done){
        body = {
            userId: '1001',
            firstname: 'zhang',
            lastname: 'san',
            age: 30,
            isMember: true,
            address: {
                country: 'CHINA',
                province: 'SiChuan',
                city: 'ChengDu',
                region: 'GaoXin'
            }
        };
        done();
    });

    after(function(done){
        done();
    });

    describe(' create user ', function () {
        it('should be ok ', function (done) {
            agent.post('/api/v1/users')
                .set('content-type', 'application/json')
                .set('x-request-id', '8bf14a542d5847bbb880039a59bf23421')
                .send(body)
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