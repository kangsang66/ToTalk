// 定义数据模型  使用sequelize来操作数据库
const { DataTypes } = require('sequelize'); // 引入sequelize 的数据类型
// 导入mysql实例
const seq = require('../db/sql');

// 建立user模型对象 => define 为建立数据库模型
const User = seq.define(
	'userInfo',
	{
		// 用户名
		userName: {
			type: DataTypes.STRING(11),
			allowNull: false, // 是否允许为空
			unique: true, //  是否唯一
			comment: '用户名 唯一',
		},
		// 密码
		passWord: {
			type: DataTypes.CHAR(64),
			allowNull: false, // 是否允许为空
			comment: '用户密码',
		},
		// 性别
		sex: {
			type: DataTypes.STRING,
			allowNull: true, // 是否允许为空
			defaultValue: 'asexual',
			comment: '性别 0为男 1为女',
		},
		// 生日
		birthdayDate: {
			type: DataTypes.DATE,
			allowNull: true, // 是否允许为空
			defaultValue: '2022.3.10',
			comment: '生日',
		},
		// 个性签名
		explain: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: '6666666',
			comment: '个性签名',
		},
		// 手机号码
		phoneNumber: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: '19138564021',
			comment: '手机号码',
		},
		// 头像
		avatar: {
			type: DataTypes.STRING,
			allowNull: true,
			comment: '头像',
		},
		// socketId
		socketId: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: '',
			comment: 'socketId',
		},
		// 状态
		staus: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: '无状态',
			comment: '状态',
		},
	},
	{
		timestamps: false, // 默认模型会生成时间戳 => 设置后会消失
	}
);
const Message = seq.define(
	'message',
	{
		// 在这里定义模型属性
		userName: {
			type: DataTypes.STRING,
			allowNull: false, // 是否允许为空
			unique: false, //  是否唯一
			comment: '用户id 唯一',
		},
		friendName: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: false,
			comment: '好友ID',
		},
		message: {
			type: DataTypes.STRING,
			comment: '消息内容',
		},
		audio: {
			type: DataTypes.BLOB('long'),
			comment: '语音消息',
		},
		duration: {
			type: DataTypes.STRING,
			comment: '语音时长',
		},
		types: {
			type: DataTypes.STRING,
			comment: '消息类型 0文字, 1音频链接, 2图片链接',
		},
		time: {
			type: DataTypes.DATE,
			comment: '生成时间',
		},
		state: {
			type: DataTypes.BOOLEAN,
			comment: '消息状态 0为已读,1为未读',
		},
	},
	{
		timestamps: false, // 默认模型会生成时间戳 => 设置后会消失
	}
);

const Friend = seq.define(
	'friend',
	{
		// 在这里定义模型属性
		userName: {
			type: DataTypes.STRING,
			allowNull: false, // 是否允许为空
			unique: false, //  是否唯一
			comment: '用户名 唯一',
		},
		friendName: {
			type: DataTypes.STRING,
			allowNull: false,
			comment: '好友用户名',
		},
		state: {
			type: DataTypes.STRING,
			comment: '好友状态 0已为好友,1为申请中,2为拒绝',
		},
		status: {
			type: DataTypes.STRING,
			allowNull: true,
			comment: '在线标识 0为不在线 1为在线',
		},
		time: {
			type: DataTypes.DATE,
		},
	},
	{
		timestamps: false, // 默认模型会生成时间戳 => 设置后会消失
	}
);
// 定义聊天记录模型
// User.sync({ force: true }); // 关闭该属性 => 设置后会导致数据库被重新创建
// Message.sync({ force: true }); // 关闭该属性 => 设置后会导致数据库被重新创建
// Friend.sync({ force: true }); // 关闭该属性 => 设置后会导致数据库被重新创建
// 导出让service层使用
module.exports = {
	User,
	Friend,
	Message,
};
