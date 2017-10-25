const should = require('should');

let a = {
    name: 'zhangsan'
};

should.exists(a);
false.should.be.false();
true.should.be.true();
should(a.name).a.String();
should(a.name).be.ok();

//be,an,a,of,with,which,been,has,have,is,the,it,and

[ 1, 2, 3].should.containDeep([2, 1]);

(10).should.be.eql(10);

({a:1}).should.be.eql({a:1});

({a:1}).should.not.be.exactly({a:1});

({}).should.be.empty();

[].should.has.length(0);

({a:10}).should.have.value('a', 10);

// res.should.be.json();
// res.should.have.status(200);

let body = {
    headers: {
        'content-type': 'application/json'
    }
};
body.should.be.json();

//////


