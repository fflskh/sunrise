
module.exports = async function errorHandler(error, ctx) {
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
        'x-server-current-time': new Date(),
        code: error.statusCode || 400,
        message: error.message || '',
        data: error.data
    };

    if(!_utils.isProductionMode) {
        body.meta.stack = error.stack;
    }

    ctx.body = body;
};