import Recorder from 'js-audio-recorder';

// == 搜索用户数据接口 ==
interface SearchResType {
	id: string | undefined;
	sex: string | undefined;
	userName: string | undefined;
	explain: string;
	phoneNumber: string | undefined;
	brithdayDate: string | undefined;
	registerDate: string | undefined;
	avatar: string | undefined;
}

// == 常用语 ==
interface UserFulExpressionType {
	command: string | number | object;
	message: string;
}
interface MsgType {
	id: number;
	msg: any;
	audio?: any;
	duration?: string;
}

interface PostMsgType {
	userName: string;
	friendName: string;
}

interface FriendsType {
	userName: string;
	sex: string;
	phoneNumber: string;
	avatar: string;
	explain: string;
}
// == 登录以及注册接口 ==
interface LoginType {
	userName: string | undefined;
	passWord: string | undefined;
}
// == 上传头像接口 ==
interface UploadAvator {
	id: string | null;
}
// == 用户朋友接口 ==
interface getFriendType {
	userName: string | undefined;
}

// == 修改个人信息接口 ==
interface editType {
	userName: string;
	sex: string;
	phoneNumber: string;
	explain: string;
}
interface ReceiveMsgType {
	audio: any;
	message: string | number;
	time: string;
	types: number;
	duration: string;
}

// == 个人信息 ==
interface TheUserInfoType {
	id: string;
	userName: string;
	sex: string;
	phoneNumber: string;
	explain: string;
}
// == 个人信息 ==
interface TheUserInfoType {
	id: string;
	userName: string;
	sex: string;
	phoneNumber: string;
	explain: string;
}
// == 保存socketId ==
interface SaveSocketIdType {
	userName: string;
	socketId: string;
}

// == 用户状态 ==
interface UserStatusType {
	userName: string;
	status: string;
}


export type {
	SearchResType,
	editType,
	LoginType,
	UploadAvator,
	getFriendType,
	MsgType,
	ReceiveMsgType,
	PostMsgType,
	FriendsType,
	TheUserInfoType,
	UserFulExpressionType,
	SaveSocketIdType,
	UserStatusType,
};
