const fs = require('fs');
const zlib = require('zlib');
const rp = require('request');
const iconv = require('iconv-lite');



request({
    uri: 'http://www.laosiji.com/cars/0/0-0-0-0-0-0-0-0-0-0-0-0-0/',
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
}).then(response => {
    console.log(response);
}).catch(console.error);

// request({
//     uri: 'http://www.laosiji.com/cars/0/0-0-0-0-0-0-0-0-0-0-0-0-0/',
//     headers: {
//         "Connection": "keep-alive",
//         "Cache-Control": "max-age=0",
//         "Upgrade-Insecure-Requests": 1,
//         "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36",
//         "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
//         "Referer": "http://www.laosiji.com/new_web/index.html",
//         "Accept-Encoding": "gzip, deflate",
//         "Accept-Language": "zh-CN,zh;q=0.9",
//         "Cookie": "__DAYU_PP=IRu3ffEInf6avN2Qm3aV3686dac12629; UM_distinctid=15fab7221dc5ce-04e1433c041644-c303767-1fa400-15fab7221dd87d; JSESSIONID=A0CC0A7E1BA8945A942552FAEE3AAC4F; CNZZDATA1261736092=1842276921-1510403921-https%253A%252F%252Fwww.baidu.com%252F%7C1512997879"
//     },
//     method: 'GET',
//     timeout: 30*1000,
//     simple: false
// }).then(response => {
//     console.log(response.headers);
// });
// .on('response', response => {
//     if(response.statusCode !== 200) {
//         console.error('xxx')
//     }
//
//     // const output = fs.createWriteStream('./index.html');
//     let buffer = Buffer.from([]);
//     switch (response.headers['content-encoding']) {
//         case 'gzip':
//             response.pipe(zlib.createGunzip()).pipe(buffer);
//             break;
//         // case 'deflate':
//         //     response.pipe(zlib.createInflate()).pipe(output);
//         //     break;
//         default:
//             response.pipe(output);
//             break;
//     }
//
//     console.log(buffer.toString('utf8'))
//
//     console.log('headers : ', response.headers);
//
//     // let chunks = [];
//     // response.on('data', data => {
//     //     console.log(data)
//     //     chunks.push(data);
//     // }).on('end', () => {
//     //     let body = Buffer.concat(chunks);
//     //     console.log(body.length);
//     // }).on('error', error => {
//     //     console.error(error);
//     // });
// });