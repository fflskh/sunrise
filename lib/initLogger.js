const bunyan = require('bunyan');

console.log('start to init logger...');

//rootLogger，可直接使用，后续也可以向logger中添加更详细的打印信息
let logger = bunyan.createLogger({
    name: _config.get('appName'),
    level: _config.get('logLevel'),
    pid: process.pid,
    src: process.env.NODE_ENV !== 'production'  //production时需要关掉源码行数，严重影响性能
});

console.error = logger.error.bind(logger);
console.warn = logger.warn.bind(logger);
console.info = logger.info.bind(logger);
console.log = logger.debug.bind(logger);
console.trace = logger.trace.bind(logger);

console.info('finish init logger.');

module.exports = logger;
