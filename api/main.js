// 引入app实例
const DEV_PORT = 1234;
const SOCKET_PORT = 4000;
const { app } = require('./src/app');
const { httpServer } = require('./src/Middleware/message.Middleware');
// 静态资源管理
const static = require('koa-static');

app.use(static(__dirname + '/public'));
// 监听事件

app.listen(DEV_PORT, () => {
	console.log(`${DEV_PORT}`);
});
httpServer.listen(SOCKET_PORT, () => {
	console.log(`${SOCKET_PORT}`);
});
