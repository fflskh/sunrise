const path = require('path');

module.exports = function (handlerPath) {
    return async function (ctx, next) {
        handlerPath = handlerPath.replace(/\./g, '/');

        ctx.logger.info(`load handler from: ${handlerPath}`);

        let handler = require(_base + handlerPath);
        if(!handler) {
            throw new Error(`can not find handler of path : ${handlerPath}`);
        }

        await handler.execute(ctx, next);
    };
};