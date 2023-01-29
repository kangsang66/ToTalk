// 数据库连接
// 1. 引入sequelize
// 2. 连接数据库
// 3. 监听数据库
// 4. 定义数据模型
// 5. 定义数据类型字段等
// 6. 查看是否已经存在该表
const { Sequelize } = require('sequelize');
// 定义数据库相关
const host = '139.224.67.36';
const database = 'electron';
const username = 'root';
const password = '123456';

const seq = new Sequelize(database, username, password, {
	host: host,
	dialect: 'mysql',
	port: 3306,
});

// const host = 'localhost';
// const database = 'electron-dingding';
// const username = 'root';
// const password = '123456';

// const seq = new Sequelize(database, username, password, {
// 	host: host,
// 	dialect: 'mysql',
// });

// 监听数据库连接
seq
	.authenticate()
	.then(() => {
		console.log('数据库连接成功');
	})
	.catch((e) => {
		console.log(e);
		console.log('数据库连接失败');
	});

module.exports = seq; // 导出连接成功的实例
