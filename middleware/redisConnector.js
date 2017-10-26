const redis = require('redis');
const bluebird = require('bluebird');

module.exports = function (config) {
    _logger.info(`connect to redis, host: ${config.host}, port: ${config.port}`);

    //promisify redis的实例方法，在原有的方法加上后缀Async。例如：原方法为get('foo')，promise方法为getAsync('foo')
    return async function (ctx, next) {
        bluebird.promisifyAll(redis.RedisClient.prototype);

        ctx.context.redisClient  = redis.createClient({
            host: config.host,
            port: config.port
        });

        await next();
    };
};