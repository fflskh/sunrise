
const Spider = require('./Spider');

const spider = new Spider({
    domain: 'http://www.laosiji.com',
    baseUrl: '/cars'
});

spider.crawl();
