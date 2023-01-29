const { Message } = require('../model/user.model');
class messageService {
	// 用户聊天保存
	async userChat({ userName, friendName, msg }) {
		await Message.create({
			userName,
			friendName,
			message: msg,
			time: new Date().getTime(),
			types: 0, // 文字为 0
			state: 0, // 已读状态
		});
	}
	// 用户语音保存
	async userAudio({ userName, friendName, msg, duration }) {
		await Message.create({
			userName,
			friendName,
			duration,
			audio: msg,
			time: new Date().getTime(),
			types: 1, // 文字为 0,语音为1
			state: 0, // 已读状态
		});
	}
}
// 导出用户模块实例
module.exports = new messageService();
