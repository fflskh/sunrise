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
                data: error.data
            };

            if(!_utils.isProductionMode) {
                body.meta.stack = error.stack;
            }

            ctx.status = 200;
            ctx.body = body;
        }
    };
};