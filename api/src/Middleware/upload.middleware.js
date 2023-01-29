// 文件上传
const multer = require('@koa/multer');
// 配置  磁盘你存储
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'public/user/avators');
	},
	filename: (req, file, cb) => {
		console.log('file======>', file);
		// 1.png
		const filterFormat = file.originalname.split('.');
		cb(null, Date.now() + `${req.body.userName}` + '.' + filterFormat[filterFormat.length - 1]);
	},
});

//文件上传限制
const limits = {
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 4, // 限制4m
	},
};
const upload = multer({ storage, limits });

// 导出上传文件实例

module.exports = upload;
