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
        let conditions = await this.resolveConditions(requestOptions);
        await this.saveLineItems('Query', conditions);

        let brands = await this.resolveBrands(requestOptions);
        await this.saveLineItems('Brand', brands);

        //TODO，是否将爬取数据和保存数据分离
        await this.resolveSeries(requestOptions);
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
                    $(this).next().next().find('label > span').each(function(){
                        values.push($(this).text());
                    });

                    conditions.push({key, values});
                });
            });
            return conditions;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async resolveBrands (requestOptions) {
        try {
            let html = await this.downloader.download(requestOptions);
            let $ = cheerio.load(html);

            let brands = [];
            $('.cars-side').find('.brand-nav-box > ul > dl').each(function() {
                let firstChar = $(this).find('dt > a').text();
                $(this).children('dd').find('a').each(function() {
                    brands.push({
                        firstChar: firstChar,
                        name: $(this).text()
                    });
                });
            });

            //将非空字符替换为一个空格
            brands.forEach(brand => {
                brand.firstChar = brand.firstChar.replace(/\s{1,}/g, '');
                brand.name = brand.name.replace(/\s{1,}/g, ' ');
            });

            return brands;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async resolveSeries (requestOptions) {
        let self = this;
        try {
            let html = await this.downloader.download(requestOptions);
            let $ = cheerio.load(html);

            $('.brand-list-by-brand').each(async function() {
                let brandImg = $(this).find('.brand-logo img').attr('src');
                let brandName = $(this).find('.brand-logo h4.title-box').text();

                // 通过brandName查询brand信息，并获取到brandId
                let brand = await self.pipeline.findOneDoc({
                    modelName: 'Brand',
                    where: {name: brandName}
                });

                //没有brand，新插入
                if(!brand) {
                    let savedBrands = await this.saveLineItems('Brand', [{name: brandName}]);
                    brand = savedBrands[0];
                }

                // 将brandImg写入brands表
                await self.pipeline.updateOneDoc({
                    modelName: 'Brand',
                    where: {
                        _id: brand._id
                    },
                    model: {
                        img: brandImg
                    }
                });

                // 写入factory
                $(this).find('.brand-content h4').each(async function() {
                    let factoryName = $(this).text().replace(/\s{1,}/g, ' ');
                    let factory = await self.pipeline.saveOne({
                        modelName: 'Factory',
                        data: {
                            brandId: brand.id,
                            name: factoryName
                        }
                    });

                    $(this).next().find('.cars-box').each(async function() {
                        //23.42-34.28万, 34.28万, 无
                        let price = $(this).find('.price em').text();
                        let minPrice = parseFloat(price) || 0;
                        let maxPrice = price.split('-').length > 1 ? parseFloat(price.split('-')[1]) : minPrice || 0;
                        let series = {
                            factoryId: factory.id,
                            thumbnail: $(this).find('.img img').attr('src'),
                            name: $(this).find('.name a').text(),
                            guidancePrice: {
                                min: minPrice,
                                max: maxPrice
                            }

                        };

                        await self.pipeline.saveOne({
                            modelName: 'Series',
                            data: series
                        })
                    });
                });
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

module.exports = Spider;
