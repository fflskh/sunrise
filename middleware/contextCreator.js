
//构建context，贯穿整个请求的始终，会用于后续创建controller
//不使用koa自带的ctx，是因为后续可能会修改到context，而且koa自带ctx体积比较大
//同时，如果对ctx的body等参数的赋值和修改，会直接影响到response
//context中存放的数据为：用户登录信息，请求状态（时间，IP，url等），logger，db/cache connector等
module.exports = () => {
    return async function (ctx, next) {
        if(!ctx.context) {
            ctx.context = {};
        }
        ctx.context.remoteAddress = ctx.ip;
        ctx.context.requestTime = new Date();

        await next();
    };
};
