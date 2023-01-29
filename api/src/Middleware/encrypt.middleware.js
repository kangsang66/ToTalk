const crypto = require('crypto-js');
const { SECRECTKEY } = require('../env/env');
// 解密数据
const decryptTheBody = async (data) => {
	// if(){
	// }
	return JSON.parse(crypto.AES.decrypt(data, SECRECTKEY).toString(crypto.enc.Utf8));
	// return data;
};
// 加密数据
const encryptTheBody = async (data) => {
	return crypto.AES.encrypt(JSON.stringify(data), SECRECTKEY).toString();
};

module.exports = {
	decryptTheBody,
	encryptTheBody,
};
