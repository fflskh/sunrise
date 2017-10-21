const util = require('util');
const moment = require('moment');

module.exports = function () {
    return async function (ctx, next) {
        let body = ctx.body;
        let response = {};

        //没有response，直接返回404
        if(!body) {
            ctx.status = 404;
            return Promise.resolve();
        }

        if(body instanceof Error) {
            throw body;
        }

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

        response.response = body;

        ctx.logger.info(`===> response: ${util.inspect(response, {depth: 3})}`);

        ctx.status = 200;
        ctx.body = response;
    };
};