import { io } from 'socket.io-client';
let Socket: any = null;

class SockstModule {
	init() {
		Socket = io('http://localhost:4000');
		Socket.on('connect', () => {
			// 设置socket.id
			localStorage.setItem('socketId', Socket.id);
		});
	}
	disconnect() {
		Socket.disconnect();
	}
}

const socket = new SockstModule();
export { Socket, socket };

// 可以封装为一个类,init函数为初始化该socket
