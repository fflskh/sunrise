const cheerio = require('cheerio');
const fs = require('fs');

let html = fs.readFileSync('./html/condition.html');

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



