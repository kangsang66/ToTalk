import { app, BrowserWindow, ipcMain } from 'electron';
const path = require('path');
let win: BrowserWindow;
//定义全局变量Header获取 窗口实例
// app.setUserTasks([
// 	{
// 		program: process.execPath,
// 		arguments: '--new-window',
// 		iconPath: process.execPath,
// 		iconIndex: 0,
// 		title: 'New Window',
// 		description: 'Create a new window',
// 	},
// ]);
const createWindow = () => {
	win = new BrowserWindow({
		minWidth: 960,
		minHeight: 640,
		width: 960,
		height: 640,
		frame: false,
		webPreferences: {
			devTools: true,
			nodeIntegration: true,
			contextIsolation: false,
			//允许html页面上的javascipt代码访问nodejs 环境api代码的能力（与node集成的意思）
		},
	});
	// 判断环境是否打包
	if (process.env.NODE_ENV != 'development') {
		win.loadFile(path.join(__dirname, '../index.html'));
	} else {
		win.loadURL(
			`http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`
		);
	}
	//VITE_DEV_SERVER_HOST 如果是undefined 换成  VITE_DEV_SERVER_HOSTNAME

	ipcMain.on('window-min', function () {
		// 收到渲染进程的窗口最小化操作的通知，并调用窗口最小化函数，执行该操作
		win.minimize();
	});
	// 2. 窗口 最大化、恢复
	ipcMain.on('window-max', function () {
		if (win.isMaximized()) {
			// 为true表示窗口已最大化
			win.restore(); // 将窗口恢复为之前的状态.
		} else {
			win.maximize();
		}
	});
	// 3. 关闭窗口
	ipcMain.on('window-close', function () {
		win.close();
	});
};
app.disableHardwareAcceleration();

//在Electron完成初始化时被触发
app.whenReady().then(createWindow);

export { ipcMain };
