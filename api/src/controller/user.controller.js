// 导入用户数据库模块
const { userRegister, getuserInfo, undatePwd } = require('../service/user.service');
const { encryptTheBody } = require('../Middleware/encrypt.middleware');
const { SECRECT } = require('../env/env');
const jwt = require('jsonwebtoken');

// 用户模块
class userController {
	// 用户登录
	async login(ctx, next) {
		try {
			// 1. 请求数据
			const { userName } = ctx.request.body;
			// 2. 通过jwt将token返回给用户,并设置时间
			// 2.1 定义私钥
			// 2.1 剔除password
			const { passWord, avatar, staus, ...res } = await getuserInfo({ userName }); // 查找当前用户朋友信息
			// 2.2 携带token
			const token = jwt.sign(res, SECRECT, { expiresIn: 120 * 60 * 60 });
			// 3. 返回数据
			let tempBody = {
				code: 200,
				message: `欢迎回来,${userName}`,
				result: {
					id: res.id,
					token,
					avatar,
					staus,
				},
			};
			// 加密数据
			ctx.response.body = await encryptTheBody(tempBody);
			
		} catch (error) {
			console.log(error.message);
		}
		await next();
	}
	// 用户注册
	async register(ctx, next) {
		const { userName, passWord } = ctx.request.body;
		try {
			// 2. 操作数据库
			// 注册成功后将注册后的token,id,username传给前端
			const res = await userRegister(userName, passWord);
			let data = await getuserInfo({ userName });
			const { id: tokenId, userName: tokenUserName } = data;
			const token = jwt.sign({ id: tokenId, userName: tokenUserName }, SECRECT, {
				expiresIn: 120 * 60 * 60,
			});
			console.log('data', data);
			// 3. 返回数据
			let tempBody = {
				code: 200,
				message: '注册成功',
				data: {
					id: data.id,
					userName: data.userName,
					staus: data.staus,
				},
				token,
			};
			// 加密数据
			ctx.response.body = await encryptTheBody(tempBody);
		} catch (error) {
			console.log('error', error);
			if (error) {
				ctx.response.body = {
					code: 500,
					message: '注册失败',
				};
			}
		}
		await next();
	}
	// 用户修改密码
	async ChangePassword(ctx, next) {
		// 1. 获取用户id => 根据用户id来修改对应用户密码
		const id = ctx.state.user.id;
		const passWord = ctx.request.body.passWord;
		// 2. 操作数据库
		if (await undatePwd({ id, passWord })) {
			let tempBody = {
				code: 200,
				message: '修改密码成功',
				result: '',
			};
			// 加密数据
			ctx.body = await encryptTheBody(tempBody);
		} else {
			ctx.body = {
				code: '10007',
				message: '修改密码失败',
				result: '',
			};
		}
		await next();
	}
}

// 导出用户模块实例
module.exports = new userController();
