const mongoose = require('mongoose');
//使用内置的Promise作为mongoose的Promise库
mongoose.Promise = global.Promise;

module.exports = function (config) {
    if(!config) {
        throw new Error('Failed to get mongodb configurations.');
    }

    _logger.info(`connect to mongodb, uri: ${config.uri}, \n options: ${JSON.stringify(config.options)}`);
    //promisify redis的实例方法，在原有的方法加上后缀Async。例如：原方法为get('foo')，promise方法为getAsync('foo')
    return async function (ctx, next) {
        await mongoose.connect(config.uri, config.options);
        await next();
    };
};