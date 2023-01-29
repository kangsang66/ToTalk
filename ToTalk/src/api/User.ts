import service from '../utils/request';
import type {
	editType,
	LoginType,
	getFriendType,
	SaveSocketIdType,
	UserStatusType,
} from '@/types/Type';

// 注册
export const register = (data: LoginType) => {
	return service({
		url: '/user/register',
		method: 'POST',
		data,
	});
};
// 登录
export const login = (data: LoginType) => {
	return service({
		url: '/user/login',
		method: 'POST',
		data,
	});
};
// 更新密码
export const patch = (data: LoginType) => {
	return service({
		url: '/user/password',
		method: 'put',
		data,
	});
};
// 搜索用户
export const searchUser = (data: string | undefined) => {
	return service({
		url: '/user/searchUser',
		method: 'post',
		data: JSON.stringify({ searchUser: data }), // 注意这里必须将数据JSON转换一下koa才能接受
	});
};
// 修改个人信息
export const editInfo = (data: editType) => {
	console.log('data', data);

	return service({
		url: '/user/editInfo',
		method: 'put',
		data, //
	});
};
// 获取朋友信息
export const getFriendInfo = (data: getFriendType) => {
	return service({
		url: '/user/friendsInfo',
		method: 'post',
		data,
	});
};

// 保存socketId
export const saveSocketId = (data: SaveSocketIdType) => {
	return service({
		url: '/user/socket',
		method: 'post',
		data,
	});
};

// 修改用户状态
export const changeStatus = (data: UserStatusType) => {
	return service({
		url: '/user/editStatus',
		method: 'put',
		data,
	});
};

// 上传头像
export const uploadAvator = (data: any) => {
	return service({
		url: '/user/avator',
		method: 'post',
		data,
	});
};
