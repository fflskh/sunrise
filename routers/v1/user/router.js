
module.exports = function (router) {
    router.get(
        '/users/:userId',
        async function getUserInfo (ctx, next) {
            ctx.body = {
                userId: 111111,
                name: 'master'
            };

            await next();
        }
    );

    router.post(
        '/users',
        async function registUser () {}
    );
};