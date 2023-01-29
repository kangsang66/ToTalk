const Koa = require('koa');
const { createServer } = require('http');

const app = new Koa();
const httpServer = createServer(app.callback());

const KoaBody = require('koa-body');
const cors = require('koa2-cors');

// user模块
const userRouter = require('../router/user.route');
// friend模块
const friendRouter = require('../router/friend.route');
// 使用koa-body => 必须在所有路由之前注册

app.use(KoaBody());
app.use(cors());
// 使用user路由模块
app.use(userRouter.routes());
app.use(friendRouter.routes());

module.exports = { app, httpServer };
