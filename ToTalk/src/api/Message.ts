import service from '../utils/request';
import { PostMsgType } from '../types/Type';
// 注册
export const getMsg = (data: PostMsgType) => {
	return service({
		url: '/friend/message',
		method: 'POST',
		data,
	});
};
