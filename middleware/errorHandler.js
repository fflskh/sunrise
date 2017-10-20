
module.exports = async function errorHandler(error, ctx) {
    ctx.body = error.message;
};