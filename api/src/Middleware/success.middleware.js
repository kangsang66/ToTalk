const { encryptTheBody } = require('./encrypt.middleware');

const uploadSuccess = async (ctx, next) => {
	let filename = ctx.state.filename;
	let tempBody = {
		code: 200,
		message: '上传成功',
		response: {
			avatar: filename,
		},
		type: 'avator',
	};
	ctx.body = await encryptTheBody(tempBody);
};

module.exports = uploadSuccess;
