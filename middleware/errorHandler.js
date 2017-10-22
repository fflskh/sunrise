const util = require('util');
const moment = require('moment');

module.exports = function () {
    return async function errorHandler(ctx, next) {
        //next以后错误都会被此处的try/catch捕获
        try {
            await next();
        } catch(error) {
            let body = {};

            //非产品环境下才打印request信息
            if(!_utils.isProductionMode) {
                body.request = {
                    method: ctx.method,
                    href: ctx.href,
                    headers: ctx.headers,
                    body: ctx.request.body
                };
            }

            body.meta = {
                'x-server-current-time': moment().format('YYYY-MM-DDTHH:mm:ssZ'),
                code: error.statusCode || 400,
                message: error.message || '',
                data: error.data || null
            };

            if(!_utils.isProductionMode) {
                body.meta.stack = error.stack;
            }

            ctx.logger.info(`===> response: ${util.inspect(body, {depth: 3})}`);

            ctx.status = 200;
            ctx.body = body;
        }
    };
};