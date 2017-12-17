const cheerio = require('cheerio');
const fs = require('fs');

let html = fs.readFileSync('./html/condition.html');

let $ = cheerio.load(html);

let obj = $('.brand-list-by-brand')[0];
let brandImg = $(obj).find('.brand-logo img').attr('src');
let brandName = $(obj).find('.brand-logo h4.title-box').text();

$(obj).find('.brand-content h4').each(async function() {
    let factoryName = $(this).text().replace(/\s{1,}/g, ' ');
    // let factory = await self.pipeline.saveOne({
    //     modelName: 'Factory',
    //     data: {
    //         brandId: brand.id,
    //         name: factoryName
    //     }
    // });

    $(this).next().find('.cars-box').each(async function() {
        //23.42-34.28万, 34.28万, 无
        let price = $(this).find('.price em').text();
        let minPrice = parseFloat(price) || 0;
        let maxPrice = price.split('-').length > 1 ? parseFloat(price.split('-')[1]) : minPrice || 0;
        let series = {
            factoryId: 1,
            thumbnail: $(this).find('.img img').attr('src'),
            name: $(this).find('.name a').text(),
            guidancePrice: {
                min: minPrice,
                max: maxPrice
            }
        };

        console.log("series: ", series);

        // await self.pipeline.saveOne({
        //     modelName: 'Series',
        //     data: series
        // })
    });
});





