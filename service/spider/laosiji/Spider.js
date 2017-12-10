const cheerio = require('cheerio');
const Scrapy = require(_base + 'lib/Scrapy');

class Spider extends Scrapy.Spider {
    constructor (opts) {
        super(opts);
    }

    async crawl (url) {
        super.crawl('/cars/0-0-0-0-0-0-0-0-0-0-0-0-0');
    }

    parseHtml (response) {
        let $ = cheerio.load(body);
    }
}

module.exports = Spider;
