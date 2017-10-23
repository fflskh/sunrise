//GET /v1/users/:userId

const User = require(_base + 'controllers/User');

class Handler {
    static validateParams (ctx) {

    }

    static getParams (ctx) {
        return {
            userId: ctx.params.userId
        };
    }

    static async execute (ctx, next) {
        let params;
        let userDao = new User();

        this.validateParams(ctx);
        params = this.getParams(ctx);

        let user = await userDao.getById(params.userId);

        ctx.body = user;

        // ctx.body = await userDao.getById(params.userId);
        await next();
    }
}

module.exports = {
    class: Handler,
    execute: Handler.execute.bind(Handler)
};
