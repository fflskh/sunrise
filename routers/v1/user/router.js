const handlerLoader = require(_base + 'middleware').handlerLoader;

module.exports = function (router) {
    router.get(
        '/users/:userId',
        handlerLoader('handlers.v1.user.get')
    );

    router.post(
        '/users',
        handlerLoader('handlers.v1.user.post')
    );
};