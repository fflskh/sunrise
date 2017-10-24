//GET /v1/users

const User = require(_base + 'controllers/User');

class Handler {
    static validateParams (ctx) {
        let body = ctx.request.body;
        if(!body.userId) {
            throw new Error('user ID is required.');
        }
    }

    static getParams (ctx) {
        let body = ctx.request.body;
        return {
            userId: body.userId,
            firstname: body.firstname,
            lastname: body.lastname,
            age: body.age,
            isMember: body.isMember,
            address: body.address
        };
    }

    static async execute (ctx, next) {
        let params;
        let userDao = new User();

        this.validateParams(ctx);
        params = this.getParams(ctx);

        let user = await userDao.createUser(params);

        ctx.body = user;

        await next();
    }
}

module.exports = {
    class: Handler,
    execute: Handler.execute.bind(Handler)
};
