// 导入用户数据库模型
const { Op } = require('sequelize');
const { User } = require('../model/user.model');
// 用户数据库模块  => 增删改查
class userService {
	// 查询用户
	async getuserInfo({ userName }) {
		const userHasExist = await User.findOne({
			//使用attributes属性进行select选择特定属性,也就是向数据库当中选择
			attributes: ['id', 'userName', 'passWord', 'avatar', 'staus'],
			where: {
				userName: userName,
			},
		});
		// 返回查找结果
		return userHasExist ? userHasExist.dataValues : null;
	}
	// 用户注册
	async userRegister(userName, passWord) {
		// 使用该实例中的create方法去创建
		const res = await User.create({
			userName: userName,
			passWord: passWord,
		});
		return res;
	}
	// 用户修改密码
	async undatePwd({ id, userName, passWord }) {
		// 获取用户id
		const whereOpt = { id };
		const newUser = {};
		// 拼接用户信息
		id && Object.assign(newUser, { id });
		userName && Object.assign(newUser, { userName });
		passWord && Object.assign(newUser, { passWord });
		const userUpdate = await User.update(newUser, {
			where: whereOpt, // 将用户名id为xxx的数据修改
		});
		return userUpdate[0] > 0 ? true : false;
	}
	// 用户修改头像
	async updateAvator({ userName, filename }) {
		const userUpdate = await User.update(
			{ avatar: filename },
			{
				where: {
					userName,
				},
			}
		);
		return userUpdate[0] > 0 ? true : false;
	}
	// 搜索用户 => 模糊搜索
	async searchUserByFuzzy({ userName }) {
		const whereOpt = {};
		// 拼接用户信息
		userName &&
			Object.assign(whereOpt, {
				userName: {
					[Op.like]: `${userName}%`,
				},
			});
		const userHasExist = await User.findAll({
			raw: true,
			//使用attributes属性进行select选择特定属性,也就是向数据库当中选择
			where: whereOpt,
			attributes: ['id', 'userName', 'sex', 'birthdayDate', 'explain', 'phoneNumber', 'avatar'],
			// offset: 10, // 跳过10个实例
		});
		// 返回查找结果
		return userHasExist.length > 0 ? userHasExist : null;
	}
	// 用户修改个人信息
	async editUserInfo({ id, userName, sex, phoneNumber, explain }) {
		const whereOpt = { id: Number(id) };
		const newUser = {};
		id && Object.assign(newUser, { id });
		userName && Object.assign(newUser, { userName });
		sex && Object.assign(newUser, { sex });
		phoneNumber && Object.assign(newUser, { phoneNumber });
		explain && Object.assign(newUser, { explain });
		const editUser = await User.update(newUser, { where: whereOpt });
		console.log('editUser[0]', editUser[0]);
		return editUser[0] > 0 ? true : false;
	}
	// 存放用户socketId
	async saveSocketId({ userName, socketId }) {
		const newUser = {};
		socketId && Object.assign(newUser, { socketId });
		const saveSocket = await User.update(newUser, { where: { userName } });
		return saveSocket[0] > 0 ? true : false;
	}
	// 更新用户状态
	async updateStatus({ userName, staus }) {
		const newUser = {};
		staus && Object.assign(newUser, { staus });
		const data = await User.update(newUser, { where: { userName }, attributes: ['staus'] });
		return data[0] > 0 ? true : false;
	}
}

// 导出用户模块实例
module.exports = new userService();
