const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const fs = require('fs');

const SuperSpider = require('../spider/Spider');

class Spider extends SuperSpider {
    constructor() {
        super();
    }

    getHeaders () {
        return {
            "Host": "www.laosiji.com",
            "Connection": "keep-alive",
            "Cache-Control": "max-age=0",
            "Upgrade-Insecure-Requests": 1,
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Cookie": "__DAYU_PP=IRu3ffEInf6avN2Qm3aV3686dac12629; UM_distinctid=15fab7221dc5ce-04e1433c041644-c303767-1fa400-15fab7221dd87d; JSESSIONID=BB0785E2213578DE5F3F068FBE6C51C1; CNZZDATA1261736092=1842276921-1510403921-https%253A%252F%252Fwww.baidu.com%252F%7C1513783441"
        }
    }

    async crawl () {
        // let conditions = await this.resolveConditions();
        // let brands = await this.resolveBrands();
        // console.log('conditions: ', conditions);
        // console.log('brands: ', brands);
        //
        // await this.saveLineItems('Query', conditions);
        // await this.saveLineItems('Brand', brands);

        //TODO，是否将爬取数据和保存数据分离
        await this.resolveSeries();

        await this.resolveSeriesBriefs();

        await this.resolveSeriesPics();
    }

    async resolveConditions () {
        let requestOptions = {
            url: 'http://www.laosiji.com/cars/0/0-0-0-0-0-0-0-0-0-0-0-0-0/',
            headers: this.getHeaders()
        };
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

    async resolveBrands () {
        //不用从页面解析，直接从接口解析（偷懒）
        let url = 'http://www.laosiji.com/Od-Car-API/lib/brand.json';
        let requestOptions = {
            url: url,
            headers: this.getHeaders()
        };

        try {
            let brands = [];
            let response = await this.downloader.download(requestOptions);
            response = JSON.parse(response);
            let brandList = response.body && response.body.brand && response.body.brand.list || [];
            brandList.forEach(item => {
                brands.push({
                    firstChar: item.abc,
                    image: {
                        height: item.image.height || null,
                        width: item.image.width || null,
                        mime: item.image.mime || '',
                        size: item.image.size || null,
                        url: item.image.url
                    },
                    name: item.name
                });
            });

            return brands;
        } catch (error) {
            console.error(error);
            throw error;
        }

        /*try {
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
        }*/
    }

    async resolveSeries () {
        let self = this;
        let chars  = 'ABCDEFGHIJKLMNOPQRSTWXYZ';
        let headers = this.getHeaders();
        let url;

        for(let i=0; i<chars.length; i++) {
            //延迟1.5s
            await _utils.delay(1500);

            url = `http://www.laosiji.com/htmldata/carsearch/${chars[i]}.html`;
            let requestOptions = {
                url: url,
                headers: headers
            };
            try {
                let html = await this.downloader.download(requestOptions);
                let $ = cheerio.load(html);

                $('.brand-list-by-brand').each(async function() {
                    let brandImg = $(this).find('.brand-logo img').attr('src');
                    let brandName = $(this).find('.brand-logo h4.title-box').text();

                    console.log('brandImg: ', brandImg);
                    console.log('brandName: ', brandName);

                    // 通过brandName查询brand信息，并获取到brandId
                    let brand = await self.pipeline.findOneDoc({
                        modelName: 'Brand',
                        where: {name: brandName}
                    });

                    //没有brand，新插入
                    if(!brand) {
                        let savedBrands = await self.saveLineItems('Brand', [{image:{url: brandImg}, name: brandName}]);
                        brand = savedBrands[0];
                    }

                    // 写入factory
                    $(this).find('.brand-content h4').each(async function() {
                        let factoryName = $(this).text().replace(/\s{1,}/g, ' ');
                        console.log('factoryName: ', factoryName);
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
                                thumbnail: $(this).find('.img img').attr('data-src'),
                                name: $(this).find('.name a').text(),
                                originalLink: 'http://www.laosiji.com' + $(this).find('.img a').attr('href'),
                                guidancePrice: {
                                    min: minPrice,
                                    max: maxPrice
                                }

                            };

                            console.log('series: ', series);

                            await self.pipeline.saveOne({
                                modelName: 'Series',
                                data: series
                            });
                        });
                    });
                });
            } catch (error) {
                console.error(error);
                throw error;
            }
        }
    }

    async resolveSeriesBriefs () {
        let parallelCount = 1;

        let count = await this.pipeline.count({
            modelName: 'Series',
            where: {}
        });

        for(let i=0; i<count;) {
            let limit = parallelCount;
            let offset = i;
            i += parallelCount;

            let series = await this.pipeline.findDocs({
                modelName: 'Series',
                where: {},
                limit,
                offset
            });

            _utils.parallel(series, parallelCount, this.resolveSingleSeriesBrief);
        }
    }

    async resolveSingleSeriesBrief (series) {
        let self = this;
        if(!series.originalLink) {
            return null;
        }

        let requestOptions = {
            url: series.originalLink,
            headers: this.getHeaders()
        };

        try {
            let briefInfos = [];
            let html = await this.downloader.download(requestOptions);
            let $ = cheerio.load(html);

            $('#by-being-sal').each(function () {
                if($(this).attr("id") === "by-being-sale")
                    return;
                try {
                    let year = parseInt($(this).attr('id').split('by-year-')[1]);
                    $(this).find('.carx-item').each(function () {
                        let info, recommend=false, onSale=false, onProduce=false, imagesUrl, configUrl;

                        info = _utils.trim($(this).find('.carx-item-table span:first').text());
                        let stateObj = $(this).find('.carx-item-table span i');
                        if(stateObj && stateObj.hasClass('state00')) {
                            recommend = true;
                        }
                        if(stateObj && stateObj.hasClass('state30')) {
                            onSale = true;
                            onProduce = false;
                        }
                        if(stateObj && stateObj.hasClass('state40')) {
                            onSale = false;
                            onProduce = false;
                        }

                        $(this).find('.carx-item-table span:last').each(function() {
                            if($(this).text() === '图片') {
                                imagesUrl = 'http://www.laosiji.com' + $(this).attr('href');
                            }
                            if($(this).text() === '配置') {
                                configUrl =  'http://www.laosiji.com' + $(this).attr('href');
                            }
                        });

                        briefInfos.push({
                            seriesId: series.id,
                            info: info,
                            year: year,
                            recommend: recommend,
                            onSell: onSale,
                            onProduce: onProduce,
                            imagesUrl: imagesUrl,
                            configUrl: configUrl
                        });
                    });
                } catch(error) {
                    console.error('resolve cars by years error : ', error);
                }
            });

            await self.pipeline.save({
                modelName: 'SeriesBrief',
                data: briefInfos
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async resolveSeriesPics() {
        let parallelCount = 1;

        let count = await this.pipeline.count({
            modelName: 'SeriesBrief',
            where: {}
        });

        for(let i=0; i<count;) {
            let limit = parallelCount;
            let offset = i;
            i += parallelCount;

            let series = await this.pipeline.findDocs({
                modelName: 'SeriesBrief',
                where: {},
                limit,
                offset
            });

            _utils.parallel(series, parallelCount, this.resolveSingleSeriesPic);
        }
    }

    async resolveSingleSeriesPic (brief) {
        let self = this;
        if(!brief.imagesUrl) {
            return null;
        }

        let requestOptions = {
            url: brief.imagesUrl,
            headers: this.getHeaders()
        };

        try {
            let html = await this.downloader.download(requestOptions);
            let $ = cheerio.load(html);
            $('car-pic-box').each(async function() {
                let category = _utils.trim($(this).find('h3').text());
                let moreUlr = 'http://www.laosiji.com' + $(this).find('h3 a').attr('href');

                await self.resolveMoreSeriesPics({
                    category,
                    url
                });
            });
        } catch(error) {
            console.error(error);
            throw error;
        }
    }

    //缩略图
    async resolveMoreSeriesPics (opts) {
        let requestOptions = {
            url: opts.url,
            headers: this.getHeaders()
        };

        try {
            let html = await this.downloader.download(requestOptions);
            let $ = cheerio.load(html);
            return  $('.car-pic-box > .pic-box > .img-box').find('img').attr('src');
        } catch(error) {
            console.error(error);
            throw error;
        }
    }

    //标清图片

    //标清图片
}

module.exports = Spider;
