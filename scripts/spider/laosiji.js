
require('../../lib/init');
const middleware = require(_base + 'middleware');
const Spider = require(_base + 'service/laosiji/Spider');

middleware.mongoConnector(_config.get('mongodb'))({}, function(error) {
    if(error) {
        console.error(error);
        process.exit(1);
    }

    let spider = new Spider();

    spider.crawl().then(() => {
        process.exit(0);
    }).catch(error => {
        console.error(error);
        process.exit(1);
    });
});

process.on('uncaughtException', function(error) {
    console.error('got uncaught exception: ', error);
    process.exit(1);
});



