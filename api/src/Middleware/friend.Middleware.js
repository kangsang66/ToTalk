// 用户中间件模块
const {
	getUserFriends,
	getUserFriendsInfo,
	getUserFriendMsg,
} = require('../service/friends.service');
const { encryptTheBody } = require('./encrypt.middleware');
// 获取用户所有朋友ID
const getUserFriendsId = async (ctx, next) => {
	const { userName } = ctx.request.body;
	const res = await getUserFriends({ userName });

	if (res) {
		console.log('res============', res);
		ctx.tempData = res;
		await next();
	} else {
		console.log('res1============', res);
		let tempBody = {
			code: 10000,
			msg: '暂无朋友,请添加好友',
		};
		ctx.body = await encryptTheBody(tempBody);
	}
};
// 获取用户所有朋友用户名、头像地址
const getUserAllFriendsInfo = async (ctx, next) => {
	let data = await getUserFriendsInfo(ctx.tempData);
	let tempBody = {
		code: 200,
		data,
	};
	ctx.body = await encryptTheBody(tempBody);
};
// 获取用户所以朋友的消息
const getUserFriendsMsg = async (ctx, next) => {
	// 需要找到我给朋友发 和 朋友给我发的消息
	const { userName, friendName } = ctx.request.body;
	let res = await getUserFriendMsg({ userName, friendName });
	console.log('res', res);
	if (res.length > 0) {
		ctx.body = {
			code: 200,
			data: {
				userMsg: res[0],
				friendMsg: res[1],
			},
			type: 'chat',
		};
		await next();
	} else {
		ctx.body = {
			code: 404,
			msg: 'none',
			type: 'chat',
		};
		await next();
	}
};
module.exports = {
	getUserFriendsId,
	getUserAllFriendsInfo,
	getUserFriendsMsg,
};
