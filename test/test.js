<<<<<<< HEAD
=======
const request = require('request');
let options = {
    "url": "http://www.laosiji.com/dealer/list",
    "headers": {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Connection": "keep-alive",
        "Content-Length": 29,
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF8",
        "Cookie": "__DAYU_PP=IRu3ffEInf6avN2Qm3aV3686dac12629; UM_distinctid=15fab7221dc5ce-04e1433c041644-c303767-1fa400-15fab7221dd87d; OdStatisticsToken=c8b92db7-968e-4e90-ab2d-7d525b020cdb-1513951510284; CNZZDATA1261736092=1842276921-1510403921-https%253A%252F%252Fwww.baidu.com%252F%7C1515503577; JSESSIONID=1E5ABAB8806BB1EB08405996B1734BFC",
        "Host": "www.laosiji.com",
        "Origin": "http://www.laosiji.com",
        "Referer": "http://www.laosiji.com/car/series/884/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36"
    },
    "method": "POST",
    "form": "seriesid=884&cityid=undefined",
    "timeout": 60000
};

async function requestPost (options) {
    options.method = 'POST';
    return new Promise((resolve, reject) => {
        request(options).on('response', function(response) {
            if(response.statusCode !== 200) {
                return reject(new Error(`response with status ${response.statusCode}`));
            }

            let chunks = [];
            response.on('data', data => {
                chunks.push(data);
            }).on('end', () => {
                let body = Buffer.concat(chunks);
                unzip(body, response.headers['content-encoding'], function(error, decodedBuffer) {
                    if(error) {
                        return reject(error);
                    }

                    return resolve(decodedBuffer.toString('utf8'));
                });
            }).on('error', reject);
        }).on('error', reject);
    });
}

requestPost(options).then(res => {
    console.log(res);
}).catch(console.error);
>>>>>>> master-spider
