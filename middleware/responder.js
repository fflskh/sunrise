const util = require('util');
const moment = require('moment');

module.exports = function () {
    return async function (ctx, next) {
        let body = ctx.body;
        let response = {};

        //默认status为200
        ctx.status = 200;
        //非产品环境下才打印request信息
        if(!_utils.isProductionMode) {
            response.request = {
                method: ctx.method,
                href: ctx.href,
                headers: ctx.headers,
                body: ctx.request.body
            };
        }

        response.meta = {
            'x-server-current-time': moment().format('YYYY-MM-DDTHH:mm:ssZ'),
            code: 200
        };

        //没有response，直接返回404
        if(!body) {
            response.meta.code = 404;
            ctx.status = 404;
        } else if(body instanceof Error) {
            throw body;
        } else {
            response.response = body;
        }

        ctx.logger.info(`===> response: ${util.inspect(response, {depth: 3})}`);
        ctx.logger.info(`used time: ${new Date() - ctx.context.requestTime} millisecond.`);
        ctx.body = response;
    };
};