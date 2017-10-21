const util = require('util');

module.exports = function () {
    return async function (ctx, next) {
        let requestData = {
            ip: ctx.ip,
            method: ctx.method,
            href: ctx.originalUrl,
            headers: ctx.headers,
            query: ctx.query,
            body: ctx.request.body
        };

        if(_utils.isProductionMode) {
            ctx.logger.info(`===> request: ${JSON.stringify(requestData)}`);
        } else {
            ctx.logger.info(`===> request: ${util.inspect(requestData, {depth: 3})}`);
        }

        await next();
    };
};