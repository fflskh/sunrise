const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const fs = require('fs');

const SuperSpider = require('../spider/Spider');

class Spider extends SuperSpider {
    constructor() {
        super();
    }

    async crawl () {
        let requestOptions = {
            url: 'http://www.laosiji.com/cars/0/0-0-0-0-0-0-0-0-0-0-0-0-0/',
            headers: {
                "Connection": "keep-alive",
                "Cache-Control": "max-age=0",
                "Upgrade-Insecure-Requests": 1,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                "Referer": "http://www.laosiji.com/new_web/index.html",
                "Accept-Encoding": "gzip, deflate",
                "Accept-Language": "zh-CN,zh;q=0.9",
                "Cookie": "__DAYU_PP=IRu3ffEInf6avN2Qm3aV3686dac12629; UM_distinctid=15fab7221dc5ce-04e1433c041644-c303767-1fa400-15fab7221dd87d; JSESSIONID=A0CC0A7E1BA8945A942552FAEE3AAC4F; CNZZDATA1261736092=1842276921-1510403921-https%253A%252F%252Fwww.baidu.com%252F%7C1512997879"
            }
        };
        let conditioins = await this.resolveConditions(requestOptions);
        await this.saveLineItems('Query', conditioins);

        // await this.scheduler.enqueue(url);
        // let scheduledUrls = await this.scheduler.batchDeQueue();
        // scheduledUrls.forEach(async url => {
        //     let response = await this.downloader.download(url);
        // });
    }

    async resolveConditions (requestOptions) {
        try {
            let html = await this.downloader.download(requestOptions);
            let $ = cheerio.load(html);

            let conditions = [];
            $('.OdCarConditionContainer > dl').each(function () {
                $(this).children('dt').each(function() {
                    let key, values=[];
                    key = $(this).text().split('：')[0];

                    values.push($(this).next().find('a').text());
                    $(this).next().next().find('a.btn > span').each(function(){
                        values.push($(this).text());
                    });

                    conditions.push({key, values});
                });
            });

            console.log('>>>>>> conditions: ', conditions);

        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

module.exports = Spider;
