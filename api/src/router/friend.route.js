// user路由模块
const Router = require('koa-router');
const friend = new Router({ prefix: '/friend' });
const { getUserFriendsMsg } = require('../Middleware/friend.Middleware');
const { decryptTheBody } = require('../Middleware/encrypt.middleware');
// 解密前端数据 request.body
friend.use(async (ctx, next) => {
	ctx.request.body = await decryptTheBody(ctx.request.body[0]);
	await next();
});
friend.post('/message', getUserFriendsMsg);

module.exports = friend;
