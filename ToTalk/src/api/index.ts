import {
	register,
	login,
	patch,
	searchUser,
	editInfo,
	getFriendInfo,
	saveSocketId,
	changeStatus,
	uploadAvator,
} from './User';
import { getMsg } from './Message';
// == 注册 ==
export const registerAPI = register;
// == 登录 ==
export const loginAPI = login;
// == 更新密码 ==
export const patchAPI = patch;
// == 搜索用户 ==
export const searchUserAPI = searchUser;
// == 修改用户信息 ==
export const editInfoAPI = editInfo;
// == 获取用户朋友信息 ==
export const getFriendInfoAPI = getFriendInfo;
// == 获取用户指定朋友聊天记录 ==
export const getMsgAPI = getMsg;
// == 保存用户socketId ==
export const saveSocketIdAPI = saveSocketId;
// == 修改用户状态 ==
export const changeStatusAPI = changeStatus;
// == 上传头像 ==
export const uploadAvatorAPI = uploadAvator;
