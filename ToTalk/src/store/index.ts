import { defineStore } from 'pinia';
// 导入唯一id名
import { name } from './store-name';

export const state = defineStore(name.name, {
	state: () => {
		// state是一个箭头函数
		return {
			changeColor: false,
			showLogin: true,
			token: '',
			avatar: '', // 头像地址
			loading: false,
			userName: '',
			socketId: '',
			NowCheckIndex: 0,
			IsStartAudio: false,
		};
	},
	// 修饰值 相当于computed
	getters: {},
	// 处理值 相当于methods
	actions: {},
});
