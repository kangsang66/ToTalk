<template>
	<div v-if="state().showLogin">
		<!-- 自定义窗口功能 -->
		<div class="header">
			<div class="header-left">
				<img src="../../public/logo/favicon.ico" alt="" />
			</div>
			<div class="header-right">
				<div class="header-right-btn" @click="minimizeWin">
					<svg width="22" height="22" viewBox="0 0 24 24">
						<g fill="none" fill-rule="evenodd">
							<path d="M0 0h24v24H0z" />
							<path fill="#dceafd" d="M3 12a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1Z" />
						</g>
					</svg>
				</div>
				<div class="header-right-btn" @click="maximizeWin">
					<svg width="22" height="22" viewBox="0 0 24 24">
						<g fill="none" fill-rule="evenodd">
							<path d="M0 0h24v24H0z" />
							<path
								fill="#dceafd"
								d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Zm14 0H6v12h12V6Z"
							/>
						</g>
					</svg>
				</div>
				<div class="header-right-btn" @click="closeWin">
					<svg width="22" height="22" viewBox="0 0 24 24">
						<g fill="none" fill-rule="evenodd">
							<path d="M0 0h24v24H0z" />
							<path
								fill="#dceafd"
								d="m12 13.414l5.657 5.657a1 1 0 0 0 1.414-1.414L13.414 12l5.657-5.657a1 1 0 0 0-1.414-1.414L12 10.586L6.343 4.929A1 1 0 0 0 4.93 6.343L10.586 12l-5.657 5.657a1 1 0 1 0 1.414 1.414L12 13.414Z"
							/>
						</g>
					</svg>
				</div>
			</div>
		</div>
		<!-- 登录 -->
		<div class="form" id="login">
			<div class="form-structor fade-in-bottom">
				<div class="signup">
					<h2 class="form-title" id="signup">注册</h2>
					<div class="form-holder">
						<input type="text" class="input" v-model="registeruserName" placeholder="用户名" />
						<input type="password" class="input" v-model="registerpassWord" placeholder="密码" />
					</div>
					<button class="submit-btn" @click="register">注册</button>
				</div>
				<div :class="['login', Login ? 'slide-up' : '']">
					<div class="center">
						<h2 class="form-title" id="login" @click="Login = !Login">登录</h2>
						<div class="form-holder">
							<input type="text" class="input" v-model="loginuserName" placeholder="用户名" />
							<input type="password" class="input" v-model="loginpassWord" placeholder="密码" />
						</div>
						<button class="submit-btn" @click="login">登录</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, h } from 'vue';
	import { state } from '../store/index';
	import { useRouter } from 'vue-router';
	import { ElMessage } from 'element-plus';
	import { registerAPI, loginAPI, saveSocketIdAPI } from '../api/index';
	import { socket } from '../socket';
	const { ipcRenderer } = window.require('electron'); // import导入会有问题 => 可以使用window.require('electron')
	// == 最小化 ==
	const minimizeWin = () => {
		ipcRenderer.send('window-min'); // 通知主进程我要进行窗口最小化操作
	};
	// == 最大化 ==
	const maximizeWin = () => {
		ipcRenderer.send('window-max'); // 通知主进程我要进行最大化 或 还原
	};
	// == 关闭 ==
	const closeWin = () => {
		ipcRenderer.send('window-close'); // 通知主进程我要关闭
	};
	const router = useRouter();
	// == 登录展示 ==
	const Login = ref(true);
	// == 注册用户名 ==
	const registeruserName = ref<string | undefined>();
	// == 注册密码 ==
	const registerpassWord = ref<string | undefined>();
	// == 登录用户名 ==
	const loginuserName = ref<string | undefined>();
	// == 登录密码 ==
	const loginpassWord = ref<string | undefined>();
	// == 注册接口 ==
	const register = async () => {
		const data = {
			userName: registeruserName.value,
			passWord: registerpassWord.value,
		};
		try {
			const res = await registerAPI(data);
			// 注册成功
			if (res.data.code === 200) {
				socket.init();
				localStorage.setItem('userName', registeruserName.value as string);
				// token存入localStorage
				localStorage.setItem('token', res.data.token);
				// 将id出入localStorage
				localStorage.setItem('id', res.data.data.id);
				localStorage.setItem('staus', res.data.data.staus);
				ElMessage({
					message: h('p', null, [h('span', null, '注册成功')]),
					type: 'success',
					center: true,
					duration: 1500,
					offset: 200,
				});
				state().loading = true;
				setTimeout(async () => {
					state().showLogin = !state().showLogin;
					router.push({
						path: '/Home/chat',
					});
					await saveSocketIdAPI({
						userName: data.userName as string,
						socketId: localStorage.getItem('socketId') as string,
					});
				}, 1500);
			}
		} catch (error: any) {
			if (error) {
				console.log('error=============>', error);
			}
		}
	};
	// == 登录接口 ==
	const login = async (e: any) => {
		const data = {
			userName: loginuserName.value,
			passWord: loginpassWord.value,
		};
		try {
			const res = await loginAPI(data);
			console.log('res', res);

			const { avatar } = res.data.result;
			// == 将头像存入pinia ==
			state().avatar = avatar;
			// 登录成功
			if (res.data.code === 200) {
				state().userName = res.data.result.userName;
				// 将用户名存入localStorage
				localStorage.setItem('userName', loginuserName.value as string);
				// token存入localStorage
				localStorage.setItem('token', res.data.result.token);
				// 将id出入localStorage
				localStorage.setItem('id', res.data.result.id);
				localStorage.setItem('avatar', res.data.result.avatar);
				localStorage.setItem('staus', res.data.result.staus);
				// == 登录成功后,连接socket ==
				socket.init();
				state().loading = true;
				ElMessage({
					message: h('p', null, [h('span', null, res.data.message)]),
					type: 'success',
					offset: 200,
					duration: 1500,
					center: true,
				});
				setTimeout(async () => {
					state().showLogin = !state().showLogin;
					router.push({
						path: '/Home/chat',
					});
					console.log('data.userName=====>', data.userName);
					console.log('socketId=====>', localStorage.getItem('socketId'));
					let res = await saveSocketIdAPI({
						userName: data.userName as string,
						socketId: localStorage.getItem('socketId') as string,
					});
				}, 1500);
			}

		} catch (error: any) {
			if (error) {
				console.log('error=============>', error);
			}
		}
	};
</script>

<style scoped lang="scss">
	@import url('https://fonts.googleapis.com/css?family=Fira+Sans');

	.header {
		position: relative;
		-webkit-app-region: drag;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 50px;
		padding: 0 15px;
		background: linear-gradient(to right, #394a6a, #394a6a);
		z-index: 10;

		&-left {
			img {
				width: 35px;
				height: 35px;
			}
		}

		&-right {
			width: 120px;
			-webkit-app-region: no-drag;
			display: flex;
			justify-content: space-between;
			align-items: center;

			&-btn {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 36px;
				height: 32px;
				transition: 0.1s;
				&:hover {
					background-color: #5c667f;
				}
			}
		}
	}

	.form {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: calc(100vh - 50px);
		background-color: #e1e8ee;
		background: url('https://images8.alphacoders.com/425/425102.png') -260px;
		background-size: 100% 100%;
	}

	.form-structor {
		background-color: #222;
		height: 550px;
		width: 350px;
		position: relative;
		overflow: hidden;
		box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px,
			rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
		transform: translateX(85%);

		&::after {
			content: '';
			opacity: 0.8;
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			background-repeat: no-repeat;
			background-position: left bottom;
			background-size: 500px;
			background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
		}

		.signup {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 65%;
			z-index: 5;
			transition: all 0.3s ease;

			&.slide-up {
				top: 5%;
				transform: translate(-50%, 0%);
				transition: all 0.3s ease;
			}

			&.slide-up .form-holder,
			&.slide-up .submit-btn {
				opacity: 0;
				visibility: hidden;
			}

			&.slide-up .form-title {
				font-size: 1em;
				cursor: pointer;
			}

			&.slide-up .form-title span {
				margin-right: 5px;
				opacity: 1;
				visibility: visible;
				transition: all 0.3s ease;
			}

			.form-title {
				color: #fff;
				font-size: 1.7em;
				text-align: center;
				display: flex;
				justify-content: center;
				align-items: center;

				span {
					color: rgba(0, 0, 0, 0.4);
					opacity: 0;
					visibility: hidden;
					transition: all 0.3s ease;
				}
			}

			.form-holder {
				border-radius: 15px;
				background-color: #fff;
				overflow: hidden;
				margin-top: 50px;
				opacity: 1;
				visibility: visible;
				transition: all 0.3s ease;

				.input {
					border: 0;
					outline: none;
					box-shadow: none;
					display: block;
					height: 30px;
					line-height: 30px;
					padding: 8px 15px;
					border-bottom: 1px solid #eee;
					width: 100%;
					font-size: 12px;

					&:last-child {
						border-bottom: 0;
					}

					&::-webkit-input-placeholder {
						color: rgba(0, 0, 0, 0.4);
					}
				}
			}

			.submit-btn {
				background-color: rgba(0, 0, 0, 0.4);
				color: rgba(256, 256, 256, 0.7);
				border: 0;
				border-radius: 15px;
				display: block;
				margin: 15px auto;
				padding: 15px 45px;
				width: 100%;
				font-size: 13px;
				font-weight: bold;
				cursor: pointer;
				opacity: 1;
				visibility: visible;
				transition: all 0.3s ease;

				&:hover {
					transition: all 0.3s ease;
					background-color: rgba(0, 0, 0, 0.8);
				}
			}
		}

		.login {
			position: absolute;
			top: 20%;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: #fff;
			z-index: 5;
			transition: all 0.3s ease;

			&::before {
				content: '';
				position: absolute;
				left: 50%;
				top: -20px;
				transform: translate(-50%, 0);
				background-color: #fff;
				width: 200%;
				height: 250px;
				border-radius: 50%;
				z-index: 4;
				transition: all 0.3s ease;
			}

			.center {
				position: absolute;
				top: calc(50% - 10%);
				left: 50%;
				transform: translate(-50%, -50%);
				width: 65%;
				z-index: 5;
				transition: all 0.3s ease;

				.form-title {
					color: #000;
					font-size: 1.7em;
					text-align: center;

					span {
						color: rgba(0, 0, 0, 0.4);
						opacity: 0;
						visibility: hidden;
						transition: all 0.3s ease;
					}
				}

				.form-holder {
					border-radius: 15px;
					background-color: #fff;
					border: 1px solid #eee;
					overflow: hidden;
					margin-top: 50px;
					opacity: 1;
					visibility: visible;
					transition: all 0.3s ease;

					.input {
						border: 0;
						outline: none;
						box-shadow: none;
						display: block;
						height: 30px;
						line-height: 30px;
						padding: 8px 15px;
						border-bottom: 1px solid #eee;
						width: 100%;
						font-size: 12px;

						&:last-child {
							border-bottom: 0;
						}

						&::-webkit-input-placeholder {
							color: rgba(0, 0, 0, 0.4);
						}
					}
				}

				.submit-btn {
					background-color: #6b92a4;
					color: rgba(256, 256, 256, 0.7);
					border: 0;
					border-radius: 15px;
					display: block;
					margin: 15px auto;
					padding: 15px 45px;
					width: 100%;
					font-size: 13px;
					font-weight: bold;
					cursor: pointer;
					opacity: 1;
					visibility: visible;
					transition: all 0.3s ease;

					&:hover {
						transition: all 0.3s ease;
						background-color: rgba(0, 0, 0, 0.8);
					}
				}
			}

			&.slide-up {
				top: 90%;
				transition: all 0.3s ease;
			}

			&.slide-up .center {
				top: 10%;
				transform: translate(-50%, 0%);
				transition: all 0.3s ease;
			}

			&.slide-up .form-holder,
			&.slide-up .submit-btn {
				opacity: 0;
				visibility: hidden;
				transition: all 0.3s ease;
			}

			&.slide-up .form-title {
				font-size: 1em;
				margin: 0;
				padding: 0;
				cursor: pointer;
				transition: all 0.3s ease;
			}

			&.slide-up .form-title span {
				margin-right: 5px;
				opacity: 1;
				visibility: visible;
				transition: all 0.3s ease;
			}
		}
	}
	.fade-in-bottom {
		-webkit-animation: fade-in-bottom 1s cubic-bezier(0.39, 0.575, 0.565, 1) both;
		animation: fade-in-bottom 1s cubic-bezier(0.39, 0.575, 0.565, 1) both;
	}
	@keyframes fade-in-bottom {
		0% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
	}
	@-webkit-keyframes fade-in-bottom {
		0% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
	}
</style>
