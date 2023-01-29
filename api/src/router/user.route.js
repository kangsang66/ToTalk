// user路由模块
const Router = require('koa-router');
const user = new Router({ prefix: '/user' });
const upload = require('../Middleware/upload.middleware');
const uploadSuccess = require('../Middleware/success.middleware');
user.allowedMethods();
// 中间件
const {
	DetermineTheUserPassword,
	DetermineTheUserHasExisted,
	EncryptTheUserPassword,
	DecryptThePassword,
	UploadTheAvatorAddress,
	searchUserName,
	editTheUserInfo,
	saveUserSocketId,
	modifyStatus,
} = require('../Middleware/user.Middleware.js');

const { decryptTheBody } = require('../Middleware/encrypt.middleware');

const { getUserFriendsId, getUserAllFriendsInfo } = require('../Middleware/friend.Middleware');
// 用户授权
const { auth } = require('../Middleware/auth.middleware');
// 导入user接口
const { login, register, ChangePassword } = require('../controller/user.controller');

// 解密前端数据 request.body
user.use(async (ctx, next) => {
	if (ctx.request.url === '/user/avator') {
		console.log('/user/avator=======>');
		await next();
	} else {
		console.log('ctx.request.body[0]====>', ctx.request.body[0]);
		ctx.request.body = await decryptTheBody(ctx.request.body[0]);
		console.log('ctx.request.body====>', ctx.request.body);
		await next();
	}
});
// 	await next();
// });

// 登录接口
user.post('/login', DetermineTheUserPassword, DecryptThePassword, login);
// 注册接口
user.post(
	'/register',
	DetermineTheUserPassword,
	DetermineTheUserHasExisted,
	EncryptTheUserPassword,
	register
);
// 保存socketId
user.post('/socket', saveUserSocketId);

// 修改密码接口
user.put('/password', auth, EncryptTheUserPassword, ChangePassword);

// 上传图片
user.post('/avator', auth, upload.single('avator'), UploadTheAvatorAddress, uploadSuccess);

// 搜索用户
user.post('/searchUser', auth, searchUserName);

// 修改个人信息
user.put('/editInfo', auth, editTheUserInfo);

// 用户朋友信息
user.post('/friendsInfo', getUserFriendsId, getUserAllFriendsInfo);

// 修改用户状态
user.put('/editStatus', modifyStatus);

// user.post('/upload', upload.single('pic'), (ctx, next) => {
// 	console.log('ctx==========>', ctx.request.file);
// });

module.exports = user;
