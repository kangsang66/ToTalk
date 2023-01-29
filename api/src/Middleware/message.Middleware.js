const { userChat, userAudio } = require('../service/message.service');
const { getUserFriendSocketId } = require('../service/friends.service');
const { httpServer } = require('../app/index');
const { Server } = require('socket.io');

const io = new Server(httpServer, {
	cors: true, // 直接他妈的设置个布尔值
});
// 跨个域

io.on('connection', (socket) => {
	const count = io.engine.clientsCount;
	console.log('当前连接数', count); // == 监听msg消息 ==
	socket.on('msg', async (sendInfo) => {
		sendMessage(sendInfo);
	});
	socket.on('audio', async (sendInfo) => {
		sendAudio(sendInfo);
	});
});

// 用户聊天发送
const sendMessage = async (sendInfo) => {
	const { msg, userName, friendName } = sendInfo;
	const frId = await getUserFriendSocketId(friendName);
	// 获取在线的匹配socket实例
	const sockets = await io.in(frId).fetchSockets();
	if (sockets.length > 0) {
		sockets[0].emit('returnmsg', msg);
		await userChat({ userName, friendName, msg });
	} else {
		await userChat({ userName, friendName, msg });
	}
};
// 用户语音发送
const sendAudio = async (sendInfo) => {
	const { msg, userName, duration, friendName } = sendInfo;
	const frId = await getUserFriendSocketId(friendName);
	const sockets = await io.in(frId).fetchSockets();
	console.log('msg====>', msg);
	const reader = new FileReader();
	reader.readAsDataURL(msg);
	let Base64 = msg;
	reader.onload = function (e) {
		return e.target.result;
	};

	// 找到指定在线用户发送,并保存
	if (sockets.length > 0) {
		sockets[0].emit('returnaudio', msg, duration);
		await userAudio({ userName, friendName, msg, duration });
		return;
	} else {
		// 如果离线,就直接保存
		await userAudio({ userName, friendName, msg, duration });
		return;
	}
};

module.exports = {
	sendMessage,
	sendAudio,
	httpServer,
};
