const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const fs = require('fs');

const SuperSpider = require('../spider/Spider');

class Spider extends SuperSpider {
    constructor() {
        super();
        this.host = 'http://www.laosiji.com';
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
        //选车条件和车辆品牌
        let [conditions, brands] = await Promise.all([
            this.resolveConditions(),
            this.resolveBrands()
        ]);

        await Promise.all([
            this.pipeline.save({
                modelName: 'Query',
                data: conditions
            }),
            this.pipeline.save({
                modelName: 'Brand',
                data: brands
            })
        ]);

        //车系列
        await this.resolveSeries();

        //每个系列简介
        await this.resolveSeriesBriefs();

        //每个系列对应的配置和图片
        await Promise.all([
            this.resolveSeriesConfigs(),
            this.resolveSeriesPics()
        ]);
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
                        let savedBrands = await self.pipeline.save({
                            modelName: 'Brand',
                            data: [{image:{url: brandImg}, name: brandName}]
                        });
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
                                originalLink: self.host + $(this).find('.img a').attr('href'),
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
            await _utils.delay(1000);
            let limit = parallelCount;
            let offset = i;
            i += parallelCount;

            let series = await this.pipeline.findDocs({
                modelName: 'Series',
                where: {},
                limit,
                offset
            });

            console.log('series: ',series);

            await _utils.parallel(series, parallelCount, this.resolveSingleSeriesBrief.bind(this));
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

            $('.carx-list-box').each(function () {
                console.log('car list div-id : ', $(this).attr("id"));
                if($(this).attr("id") === "by-being-sale") {
                    return;
                }

                try {
                    let year = parseInt($(this).attr('id').split('by-year-')[1]);
                    $(this).find('.carx-item').each(function () {
                        let info, recommend=false, onSale=true, onProduce=true, imagesUrl, configUrl;

                        let objs = $(this).find('.carx-item-table span');
                        let first = objs[0];    // '.carx-item-table span:first'
                        let last = objs[2];     // '.carx-item-table span:last'
                        info = _utils.trim($(first).text());
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

                        $(last).find('a').each(function() {
                            if($(this).text() === '图片') {
                                imagesUrl = self.host + $(this).attr('href');
                            }
                            if($(this).text() === '配置') {
                                configUrl =  self.host + $(this).attr('href');
                            }
                        });

                        briefInfos.push({
                            seriesId: series.id,
                            info: info,
                            year: year,
                            recommend: recommend,
                            onSale: onSale,
                            onProduce: onProduce,
                            imagesUrl: imagesUrl,
                            configUrl: configUrl,
                            hasImageCrawled: false,
                            hasConfigCrawled: false
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
            where: {hasCrawled: {$ne: true}}
        });

        for(let i=0; i<count;) {
            await _utils.delay(1000);

            let limit = parallelCount;
            let offset = i;
            i += parallelCount;

            let series = await this.pipeline.findDocs({
                modelName: 'SeriesBrief',
                where: {hasCrawled: {$ne: true}},
                limit,
                offset
            });

            console.log("series: ", series);

            try {
                await _utils.parallel(series, parallelCount, this.resolveSingleSeriesPic.bind(this));
            } catch(error) {
                console.warn('some error ocurrs');
            }
        }
    }

    async resolveSingleSeriesPic (brief) {
        let self = this;
        //没有图片，直接pass
        if(!brief.imagesUrl || !_utils.isUrl(brief.imagesUrl, this.host)) {
            await self.pipeline.updateDocs({
                modelName: 'SeriesBrief',
                where: {_id: brief.id},
                model: {hasImageCrawled: true}
            });

            return null;
        }

        let requestOptions = {
            url: brief.imagesUrl,
            headers: this.getHeaders(),
            timeout: 2*60*1000 //超时时间2min
        };

        try {
            let html = await this.downloader.download(requestOptions);
            let $ = cheerio.load(html);

            let objs = [];
            $('.car-pic-box').each(function() {
                objs.push(this);
            });

            //一个系列的车图片有四种，每次并行一个
            _utils.parallel(objs, 1, async function (obj) {
                let category = _utils.trim($(obj).find('h3').text()).slice(0,2);
                let moreUrl = self.host + $(obj).find('h3 a').attr('href');


                let images = await self.resolveSeriesThumbnails({url: moreUrl});
                let pics = {
                    seriesBriefId: brief.id,
                    category: category,
                    images: images
                };

                // console.log('pics: ', pics);

                await self.pipeline.save({
                    modelName: 'SeriesImage',
                    data: pics
                });

                await self.pipeline.updateDocs({
                    modelName: 'SeriesBrief',
                    where: {_id: brief.id},
                    model: {hasImageCrawled: true}
                });
            });
        } catch(error) {
            console.error(error);
            throw error;
        }
    }

    //缩略图
    /**
     * 返回格式如：
     * {
     *     thumbnails: [],
     *     standard: [],
     *     high: []
     * }
     * @param opts
     * @returns {Promise}
     */
    async resolveSeriesThumbnails (opts) {
        let self = this;
        let requestOptions = {
            url: opts.url,
            headers: this.getHeaders()
        };

        try {
            let html = await this.downloader.download(requestOptions);
            let $ = cheerio.load(html);
            let objs = [];
            $('.car-pic-box > .pic-box > .img-box').each(function() {
                objs.push(this);
            });

            //缩略图比较多，需要控制下载的数量
            let rs = await _utils.parallel(objs, 5, async function(obj) {
                let image = {};
                image.thumbnail = $(obj).find('img').attr('src');

                let standardQualityLink = self.host + $(obj).find('a').attr('href');
                let res = await self.resolveSeriesStandardQuality({url: standardQualityLink});
                image.standard = res.standard;
                image.high = res.high;

                return image;
            });

            return rs;
        } catch(error) {
            console.error(error);
            throw error;
        }
    }

    //标清图片
    async resolveSeriesStandardQuality (opts) {
        let self = this;
        let requestOptions = {
            url: opts.url,
            headers: this.getHeaders()
        };

        try {
            let html = await this.downloader.download(requestOptions);
            let $ = cheerio.load(html);
            let standardQuality = $('.picinfo-main > img').attr('src');
            let highQuality = $('.picinfo-right > a').attr('href');

            return {
                standard: standardQuality,
                high: highQuality
            };
        } catch(error) {
            console.error(error);
            throw error;
        }
    }

    async resolveSeriesConfigs () {
        let parallelCount = 1;

        let count = await this.pipeline.count({
            modelName: 'SeriesBrief',
            where: {hasConfigCrawled: {$ne: true}}
        });

        for(let i=0; i<count;) {
            await _utils.delay(500);

            let limit = parallelCount;
            let offset = i;
            i += parallelCount;

            let series = await this.pipeline.findDocs({
                modelName: 'SeriesBrief',
                where: {hasConfigCrawled: {$ne: true}},
                limit,
                offset
            });

            try {
                await _utils.parallel(series, parallelCount, this.resolveSingleSeriesConfig.bind(this));
            } catch(error) {
                console.warn('some error ocurrs');
            }
        }
    }

    async resolveSingleSeriesConfig (brief) {
        let self = this;
        //没有配置，直接pass
        if(!brief.configUrl) {
            await self.pipeline.updateDocs({
                modelName: 'SeriesBrief',
                where: {_id: brief.id},
                model: {hasConfigCrawled: true}
            });

            return null;
        }

        //直接通过接口爬取的headers比网页爬取header特殊些
        let headers = {
            "Host": "www.laosiji.com",
            "Connection": "keep-alive",
            "Content-Length": "11",
            "Origin": "http://www.laosiji.com",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36",
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            "Accept": "*/*",
            "Referer": brief.configUrl,
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Cookie": "__DAYU_PP=IRu3ffEInf6avN2Qm3aV3686dac12629; UM_distinctid=15fab7221dc5ce-04e1433c041644-c303767-1fa400-15fab7221dd87d; OdStatisticsToken=c8b92db7-968e-4e90-ab2d-7d525b020cdb-1513951510284; JSESSIONID=5FD5D224E3B009BE7D9E6F5A9A75F03B; CNZZDATA1261736092=1842276921-1510403921-https%253A%252F%252Fwww.baidu.com%252F%7C1514202098"
        };

        try {
            //直接通过接口爬取，不通过页面爬取
            let carsid = brief.configUrl.match(/config\/[0-9]{1,}/g)[0].replace('config/', '').replace('/', '');
            carsid = parseInt(carsid);
            let configUrl = this.host + '/api/car/carsconfig';

            let requestOptions = {
                url: configUrl,
                headers: headers,
                method: 'POST',
                form: {carsid: carsid},
                timeout: 2*60*1000 //超时时间2min
            };

            let json = await this.downloader.postDownload(requestOptions);
            if(typeof json === 'string') {
                json = JSON.parse(json);
            }

            let configList = json.body.configs.list;

            await _utils.parallel(configList, 10, async function (config) {
                //一个config list解析错误，不要影响其他的
                try {
                    let configEntity = {};

                    let specName = config.spec_name.split(' ').slice(1).join(' ');
                    console.log(`specName: `, specName);
                    let seriesBrief = await self.pipeline.findOneDoc({
                        modelName: 'SeriesBrief',
                        where: {
                            info: {
                                $regex: new RegExp(specName)
                            }
                        }
                    });

                    configEntity.seriesBriefId = seriesBrief.id;
                    configEntity.details = {};

                    for(let item of config.items) {
                        if(!configEntity.details[item.name]) {
                            configEntity.details[item.name] = []
                        }

                        for(let conf of item.confs) {
                            configEntity.details[item.name].push({[conf.sub]: conf.value});
                        }
                    }

                    await self.pipeline.saveOne({
                        modelName: 'SeriesConfig',
                        data: configEntity
                    });

                    await self.pipeline.updateOneDoc({
                        modelName: 'SeriesBrief',
                        where: {id: seriesBrief.id},
                        model: {hasConfigCrawled: true}
                    });
                } catch(error) {
                    console.error(error);
                }
            });

        } catch(error) {
            console.error(error);
        }
    }
}

module.exports = Spider;
