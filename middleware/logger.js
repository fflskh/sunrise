const bunyan = require('bunyan');
module.exports = () => {
    return async function (ctx, next) {
        if(!_logger) {
            _logger = bunyan.createLogger({
                name: _config.get('appName'),
                level: _config.get('logLevel'),
                pid: process.pid,
                src: process.env.NODE_ENV !== 'production'  //production时需要关掉源码行数，严重影响性能
            });
        }

        ctx.context.logger = ctx.logger = _logger.child({
            ip: ctx.ip,
            'request-line': ctx.method + ' ' + ctx.url + ' HTTP/' + ctx.req.httpVersion
        });

        await next();
    };
};