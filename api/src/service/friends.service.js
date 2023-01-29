const { Op } = require('sequelize');
const { Friend } = require('../model/user.model');
const { User } = require('../model/user.model');
const { Message } = require('../model/user.model');
class friendService {
	// 查询用户朋友UserName
	async getUserFriends({ userName }) {
		console.log('userName', userName);
		let Friends = await Friend.findAll({ attributes: ['friendName'], where: { userName } });
		let Arr = [];
		console.log('Friends', Friends.length);
		if (Friends.length > 0) {
			console.log(6666);
			Friends.forEach((f) => {
				Arr.push(f.dataValues.friendName);
				return f.dataValues.friendName;
			});
		}
		console.log('Arr.length', Arr.length);
		return Arr.length > 0 ? Arr : null;
	}
	// 查询用户朋友其他信息
	async getUserFriendsInfo(UserNames) {
		console.log('UserNames', UserNames);
		const Arr = [];
		if (UserNames.length > 0) {
			let res = await User.findAll({
				attributes: ['userName', 'avatar', 'sex', 'explain', 'phoneNumber'],
				where: { userName: { [Op.in]: UserNames } },
			});
			console.log('2');
			if (res.length > 0) {
				res.forEach((r) => {
					Arr.push(r.dataValues);
				});
			}
		}
		console.log('Arr====>', Arr);
		return Arr.length > 0 ? Arr : null;
	}
	// 查询用户给朋友发的消息以及朋友给用户发的消息
	async getUserFriendMsg({ userName, friendName }) {
		const rightArr = [];
		const leftArr = [];
		// 先查询我给朋友发的
		let rightMsg = await Message.findAll({
			attributes: ['message', 'audio', 'duration', 'types', 'time'],
			where: {
				userName,
				friendName,
			},
		});
		rightMsg.forEach((r) => {
			rightArr.push(r.dataValues);
		});
		// 再查询朋友给我发的消息
		let leftMsg = await Message.findAll({
			attributes: ['message', 'audio', 'duration', 'types', 'time'],
			where: {
				userName: friendName,
				friendName: userName,
			},
		});
		leftMsg.forEach((r) => {
			leftArr.push(r.dataValues);
		});
		return [rightArr, leftArr];
	}
	// 查询在线朋友socketId
	async getUserFriendSocketId(friendName) {
		const friendSocketId = await User.findOne({
			where: {
				userName: friendName,
			},
			attributes: ['socketId'],
		});
		return friendSocketId.dataValues.socketId;
	}
}

// 导出用户模块实例
module.exports = new friendService();
