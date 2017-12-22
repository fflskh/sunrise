const cheerio = require('cheerio');
const fs = require('fs');
const _utils = require('../../lib/utils');

let html = fs.readFileSync('./html/D.html');

let $ = cheerio.load(html);

$('.brand-list-by-brand').each(async function() {
    let brandImg = $(this).find('.brand-logo img').attr('src');
    let brandName = $(this).find('.brand-logo h4.title-box').text();

    console.log('brandImg : ', brandImg);
    console.log('brandName : ', brandName);

    // // 通过brandName查询brand信息，并获取到brandId
    // let brand = await self.pipeline.findOneDoc({
    //     modelName: 'Brand',
    //     where: {name: brandName}
    // });
    //
    // //没有brand，新插入
    // if(!brand) {
    //     let savedBrands = await this.saveLineItems('Brand', [{image:{url: brandImg}, name: brandName}]);
    //     brand = savedBrands[0];
    // }

    // 写入factory
    $(this).find('.brand-content h4').each(async function() {
        let factoryName = $(this).text().replace(/\s{1,}/g, ' ');
        // let factory = await self.pipeline.saveOne({
        //     modelName: 'Factory',
        //     data: {
        //         brandId: brand.id,
        //         name: factoryName
        //     }
        // });

        console.log('factoryName : ', factoryName);

        $(this).next().find('.cars-box').each(async function() {
            //23.42-34.28万, 34.28万, 无
            let price = $(this).find('.price em').text();
            let minPrice = parseFloat(price) || 0;
            let maxPrice = price.split('-').length > 1 ? parseFloat(price.split('-')[1]) : minPrice || 0;
            let series = {
                factoryId: 1,
                thumbnail: $(this).find('.img img').attr('data-src'),
                name: $(this).find('.name a').text(),
                guidancePrice: {
                    min: minPrice,
                    max: maxPrice
                }

            };

            console.log('series : ', series);

            // await self.pipeline.saveOne({
            //     modelName: 'Series',
            //     data: series
            // })
        });
    });
});






