//POST /v1/users

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
            userId: parseInt(body.userId, 10),
            firstname: body.firstname,
            lastname: body.lastname,
            age: parseInt(body.age, 10),
            isMember: body.isMember,
            address: body.address
        };
    }

    static async execute (ctx, next) {
        let context = ctx.context;
        let userDao = new User(context);
        let params;

        this.validateParams(ctx);
        params = this.getParams(ctx);
        let user = await userDao.createUser(params);

        ctx.body = {
            userId: 1,
            name: 'hahah'
        };

        await next();
    }
}

module.exports = {
    class: Handler,
    execute: Handler.execute.bind(Handler)
};
