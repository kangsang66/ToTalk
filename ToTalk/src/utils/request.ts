import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import crypto from 'crypto-js';
import { ElMessage } from 'element-plus';
const SECRECTKEY = import.meta.env.VITE_SECRECT_KET;
// 创建axios实例
const service = axios.create({
	baseURL: 'http://localhost:1234',
	timeout: 5000,
	headers: {
		// 请求头格式声明
		'Content-Type': 'application/json;charset=utf-8',
	},
});
// 请求拦截器
service.interceptors.request.use(
	(config: AxiosRequestConfig) => {
		// 可能不存在该属性=> 赋值为空对象
		config.headers = config.headers || {};
		if (localStorage.getItem('token')) {
			// 可能不存在token => 赋值为空字符串
			config.headers.authorization = localStorage.getItem('token') || '';
		}
		// 不加密formData
		if (config.url === '/user/avator') {
			return config;
		} else {
			config.data = [crypto.AES.encrypt(JSON.stringify(config.data), SECRECTKEY).toString()];
			return config;
		}
	},
	(err) => {
		console.log('error========>', err);
	}
);

// 响应拦截器instance.interceptors.reponse.use(req=>{}, err=>{});
service.interceptors.response.use(
	async (config: AxiosResponse) => {
		// 如果是聊天信息就不加密,太大了
		if (config.data.type === 'chat') {
			return config;
		} else {
			config.data = await JSON.parse(
				crypto.AES.decrypt(config.data, SECRECTKEY).toString(crypto.enc.Utf8)
			);
		}
		return config;
	},
	(err) => {
		if (err.response.data.code === 10001) {
			ElMessage({
				message: h('p', null, [h('span', null, err.response.data.message)]),
				type: 'error',
				duration: 1500,
				center: true,
				offset: 200,
			});
		}
		if (err.response.data.code === 10001) {
			ElMessage({
				message: h('p', null, [h('span', null, err.response.data.message)]),
				type: 'error',
				duration: 1500,
				center: true,
				offset: 200,
			});
		}
		if (err.response.data.code === 10002) {
			ElMessage({
				message: h('p', null, [h('span', null, err.response.data.message)]),
				type: 'error',
				duration: 1500,
				center: true,
				offset: 200,
			});
		}
		// 10003,用户不存在,请检查用户名或密码
		if (err.response.data.code === 10003) {
			ElMessage({
				message: h('p', null, [h('span', null, err.response.data.message)]),
				type: 'error',
				duration: 1500,
				center: true,
				offset: 200,
			});
		}
		// 10004,用户名或密码错误
		if (err.response.data.code === 10004) {
			ElMessage({
				message: h('p', null, [h('span', null, err.response.data.message)]),
				type: 'error',
				duration: 1500,
				center: true,
				offset: 200,
			});
		}
		return Promise.reject(err.response.data.message);
	}
);
export default service;
