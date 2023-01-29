const { SECRECT } = require('../env/env');
const jwt = require('jsonwebtoken');

// 用户授权中间件
const auth = async (ctx, next) => {
	console.log('filename=========>', ctx.request.body);
	try {
		// 从请求头中结构出用户携带的tokne
		const { authorization } = ctx.request.header;
		// 去除token前面的内容
		const token = authorization.replace('Bearer ', '');
		const user = jwt.verify(token, SECRECT);
		// 将token未过期的用户挂载到state.user下
		ctx.state.user = user;
	} catch (err) {
		switch (err.name) {
			case 'TokenExpiredError':
				return (ctx.body = {
					code: 10101,
					message: 'token已过期',
					result: '',
				});

			case 'JsonWebTokenError':
				return (ctx.body = {
					code: 10102,
					message: '无效的token',
					result: '',
				});
		}
	}
	await next();
};

module.exports = {
	auth,
};
