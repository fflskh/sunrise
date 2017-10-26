//GET /v1/users/:userId

const User = require(_base + 'controllers/User');

class Handler {
    static validateParams (ctx) {
    }

    static getParams (ctx) {
        return {
            userId: parseInt(ctx.params.userId, 10)
        };
    }

    static async execute (ctx, next) {
        let context = ctx.context;
        let userDao = new User(context);
        let params;

        this.validateParams(ctx);
        params = this.getParams(ctx);

        let user = await userDao.getByUserId(params.userId);

        //response statusCode的返回应该放在handler中完成
        if(!user) {
            ctx.logger.warn(`user with ID: ${params.userId} does not exist.`);
        }

        ctx.body = user;

        await next();
    }
}

module.exports = {
    class: Handler,
    execute: Handler.execute.bind(Handler)
};
