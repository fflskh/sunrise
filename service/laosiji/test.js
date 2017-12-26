const cheerio = require('cheerio');
const fs = require('fs');
const _utils = require('../../lib/utils');
global._utils = _utils;

function getHeaders() {
    return {
        "Host": "www.laosiji.com",
        "Connection": "keep-alive",
        "Content-Length": "11",
        "Origin": "http://www.laosiji.com",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "Accept": "*/*",
        "Referer": "http://www.laosiji.com/api/car/carsconfig",
        "Accept-Encoding": "gzip, deflate",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cookie": "__DAYU_PP=IRu3ffEInf6avN2Qm3aV3686dac12629; UM_distinctid=15fab7221dc5ce-04e1433c041644-c303767-1fa400-15fab7221dd87d; OdStatisticsToken=c8b92db7-968e-4e90-ab2d-7d525b020cdb-1513951510284; JSESSIONID=5FD5D224E3B009BE7D9E6F5A9A75F03B; CNZZDATA1261736092=1842276921-1510403921-https%253A%252F%252Fwww.baidu.com%252F%7C1514202098"
    };
}

async function resolveSingleSeriesConfig(url) {
    let self = this;
    //没有图片，直接pass
    if (!url) {
        return null;
    }

    try {
        //直接通过接口爬取，不通过页面爬取
        let carsid = url.match(/config\/[0-9]{1,}/g)[0].replace('config/', '').replace('/', '');
        carsid = parseInt(carsid);
        let configUrl = 'http://www.laosiji.com' + '/api/car/carsconfig';

        let requestOptions = {
            url: configUrl,
            headers: getHeaders(),
            method: 'POST',
            form: {carsid: carsid},
            timeout: 2 * 60 * 1000 //超时时间2min
        };
        console.log(requestOptions);
        let json = await _utils.requestPost(requestOptions);
        return json;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

resolveSingleSeriesConfig('http://www.laosiji.com/car/spec/config/32040/').then(res => {
    console.log(res);
}).catch(console.error);

