/*
* config插件会获取指定目录（默认config目录）下的default.json作为基础的配置文件，
* 并通过当前环境变量中的NODE_ENV来获取指定的配置文件（NODE_ENV=test,则获取test.json）,
* 然后将通过环境变量获取到的配置文件，覆盖掉default.json
*/
const config = require('config');
console.info('initialized config ...');
console.log('config NODE_ENV: ' + config.util.getEnv('NODE_ENV'));
module.exports = config;
