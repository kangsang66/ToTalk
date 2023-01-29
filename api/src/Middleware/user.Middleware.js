// 用户中间件模块
const {
	getuserInfo,
	updateAvator,
	searchUserByFuzzy,
	editUserInfo,
	saveSocketId,
	updateStatus,
} = require('../service/user.service');
const { encryptTheBody } = require('./encrypt.middleware');
// 解密bcryptjs
const bcrypt = require('bcryptjs');
// 判断用户密码
const DetermineTheUserPassword = async (ctx, next) => {
	const { userName, passWord } = ctx.request.body;
	// 判断用户名 | 密码是否为空
	if (!userName | !passWord) {
		ctx.status = 400;
		ctx.body = {
			code: 10001,
			message: '用户名或密码为空',
			result: '',
		};
		return;
	}
	await next();
};
// 判断是否已经存在该用户
const DetermineTheUserHasExisted = async (ctx, next) => {
	const { userName } = ctx.request.body;
	// 查找用户
	if (await getuserInfo({ userName })) {
		// 409状态码 => 表示请求资源冲突
		ctx.status = 409;
		ctx.body = {
			code: 10002,
			message: '用户已经存在,请输入不同用户名',
			result: '',
		};
		return;
	}

	await next();
};

// 加密password
const EncryptTheUserPassword = async (ctx, next) => {
	const { passWord } = ctx.request.body;
	// 调用加盐方法
	const salt = bcrypt.genSaltSync(10);
	// 返回加密后的密码
	const hashPwd = bcrypt.hashSync(passWord, salt);
	// 将密码重新赋值
	ctx.request.body.passWord = hashPwd;
	await next();
};

// 解密密码
const DecryptThePassword = async (ctx, next) => {
	// 1 .判断用户名是否存在
	try {
		const { userName, passWord } = ctx.request.body;
		const res = await getuserInfo({ userName });
		// 如果用户不存在
		if (!res) {
			ctx.status = 409;
			ctx.body = {
				code: 10003,
				message: '用户不存在,请检查用户名或密码',
				result: '',
			};
			return;
		}
		// 2. 判断密码是否正确,通过将当前的加盐后的密码与数据库密码进行比对
		// 比较数据库密码与当前加盐后的密码
		if (!bcrypt.compareSync(passWord, res.passWord)) {
			ctx.status = 409;
			ctx.body = {
				code: 10004,
				message: '用户名或密码错误',
				result: '',
			};
			return;
		}
	} catch (error) {
		console.error(error);
		return;
	}
	await next();
};

// 保存图片地址
const UploadTheAvatorAddress = async (ctx, next) => {
	const { filename } = ctx.file;

	const { userName } = ctx.request.body;
	let res = await updateAvator({ userName, filename });
	// 如果图片文件地址保存成功,将地址放在ctx下,然后下一个中间件返回给前端
	if (res == true) {
		ctx.state.filename = filename;
	}
	console.log('ctx.state.filename========>', ctx.state.filename);
	await next();
};

// 搜索用户
const searchUserName = async (ctx, next) => {
	// 根据用户的输入来返回数据库中的数据
	// const xx = ctx.request.body
	const { searchUser } = ctx.request.body;
	let searchRes = await searchUserByFuzzy({ userName: searchUser });
	if (searchRes) {
		let tempBody = {
			code: 200,
			msg: '查询成功',
			data: searchRes,
		};
		ctx.body = await encryptTheBody(tempBody);
	} else {
		ctx.body = {
			code: 404,
			msg: '查无此人',
			data: searchRes,
		};
	}
	await next();
};
// 修改个人信息
const editTheUserInfo = async (ctx, next) => {
	const { id, userName, sex, phoneNumber, explain } = ctx.request.body;
	try {
		let res = await editUserInfo({ id, userName, sex, phoneNumber, explain });
		console.log(res);
		if (res > 0) {
			let tempBody = {
				code: 200,
				msg: '修改成功',
				data: res,
			};
			ctx.body = await encryptTheBody(tempBody);
		}
	} catch (error) {
		console.log('error', error);
		if (error) {
			ctx.body = {
				code: 404,
				msg: '修改失败',
			};
		}
	}
	await next();
};

// 存放socketId
const saveUserSocketId = async (ctx, next) => {
	const { userName, socketId } = ctx.request.body;
	console.log(userName, socketId);
	const data = await saveSocketId({ userName, socketId });
	if (data) {
		let tempBody = {
			code: 200,
			msg: 'success',
		};
		ctx.body = await encryptTheBody(tempBody);
	}
	await next();
};

// 修改用户状态
const modifyStatus = async (ctx, next) => {
	const { userName, status: staus } = ctx.request.body;
	console.log(userName, staus);
	try {
		const task = await updateStatus({ userName, staus });
		if (task) {
			let tempBody = {
				code: 200,
				msg: '修改成功',
			};
			ctx.body = await encryptTheBody(tempBody);
		} else {
			ctx.body = {
				code: 10001,
				msg: `已为当前状态`,
			};
		}
	} catch (error) {
		if (error) {
			ctx.body = {
				code: 10002,
				msg: `修改失败${error.message}}`,
			};
		}
	}
};

module.exports = {
	DetermineTheUserPassword,
	DetermineTheUserHasExisted,
	EncryptTheUserPassword,
	DecryptThePassword,
	UploadTheAvatorAddress,
	searchUserName,
	editTheUserInfo,
	saveUserSocketId,
	modifyStatus,
};
