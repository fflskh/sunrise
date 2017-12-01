const cheerio = require('cheerio');
const Scrapy = require(_base + 'lib/Scrapy');

class Spider extends Scrapy.Spider {
    constructor (opts) {
        super(opts);
    }

    async crawl () {
        await this.openRequest('/cars/0-0-0-0-0-0-0-0-0-0-0-0-0');
        while(1) {
            let response = await this.engine.receiveDownloadResponse(res);
        }
    }

    parseHtml (response) {
        let $ = cheerio.load(body);
    }
}

module.exports = Spider;
