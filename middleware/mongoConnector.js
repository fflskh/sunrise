const mongoose = require('mongoose');

module.exports = function (config) {
    if(!config) {
        throw new Error('Failed to get mongodb configurations.');
    }
    //promisify redis的实例方法，在原有的方法加上后缀Async。例如：原方法为get('foo')，promise方法为getAsync('foo')
    return async function (ctx, next) {
        await mongoose.connect(config.uri, config.options);
        mongoose.Promise = global.Promise;
        await next();
    };
};