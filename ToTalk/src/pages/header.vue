<script setup lang="ts">
	import { state } from '../store';
	import { Search, CloseBold } from '@element-plus/icons-vue';
	import { patchAPI, searchUserAPI, editInfoAPI, changeStatusAPI } from '../api';
	import { SearchResType, TheUserInfoType } from '../types/Type';
	import { ElMessage } from 'element-plus';
	import study from '../components/SVG/status/study.vue';
	import doNotDisturb from '../components/SVG/status/doNotDisturb.vue';
	import getOff from '../components/SVG/status/getOff.vue';
	import type { UploadProps } from 'element-plus';
	import CryptoJS from 'crypto-js';
	const BASEURL = import.meta.env.VITE_BASE_URL;
	const VITE_SECRECT_KET = import.meta.env.VITE_SECRECT_KET;
	const SearchuserName = ref<string | undefined>('');
	const showToast = ref(null);
	const pathPwd = ref(null);
	const statu = ref(null);
	const eidt = ref(null);
	const name = ref(null);
	const birth = ref(null);
	const icon = ref(null);
	const UserHeader = ref(null);
	const UserHeaderImg = ref(null);
	const username = ref(null);
	const userstatu = ref(null);
	const SearchNoData = ref(false);
	const centerDialogVisible = ref(false);
	const updateUserStatus = ref(false);
	const showTip = ref(false);
	const UserStatu = ref();
	const NowStaus = ref(localStorage.getItem('staus'));
	const NowUserName = ref(localStorage.getItem('userName'));
	const activeIndex = ref(0);
	const localUserName = {
		userName: NowUserName.value,
	};
	console.log(localUserName.userName);

	const UserStatusList = markRaw([
		{
			component: study,
			Statutitle: '掉头发中',
		},
		{
			component: doNotDisturb,
			Statutitle: '请勿打扰',
		},
		{
			component: getOff,
			Statutitle: '下班了',
		},
	]);
	// == 修改 ==
	const changeBgColor = (index: number) => {
		activeIndex.value = index;
	};
	let SearchData = ref<SearchResType[]>([]);

	const handleClose = (done: () => void) => {
		drawer.value = !drawer.value;
		SearchData.value = []; // 重新赋值数据
		SearchNoData.value = false;
		done();
	};
	const drawer = ref(false);
	const direction: any = 'ttb';
	const imageUrl = ref('../../public/avatars/logo.png');
	const showPatchPwd = ref(false);
	const formLabelWidth = '140px';

	const form = reactive({
		password: '',
		realPassword: '',
	});

	const { ipcRenderer } = window.require('electron'); // import导入会有问题 => 可以使用window.require('electron')
	//  methods 中 写下边三个方法，并且绑定到你自己的document 上。
	const minimizeWin = () => {
		ipcRenderer.send('window-min'); // 通知主进程我要进行窗口最小化操作
	};
	const maximizeWin = () => {
		ipcRenderer.send('window-max'); // 通知主进程我要进行最大化 或 还原
	};
	const closeWin = () => {
		ipcRenderer.send('window-close'); // 通知主进程我要关闭
	};

	// == 展示个人信息 ==
	const showUserInfo = ref(false);
	const editTheUserInfo = () => {
		showUserInfo.value = !showUserInfo.value; // 显示
	};

	let TheUserInfo = reactive<TheUserInfoType>({
		id: localStorage.getItem('id') as string,
		userName: localStorage.getItem('userName') as string,
		sex: '',
		phoneNumber: '',
		explain: '',
	});
	let TheUserInfoBefore = {};
	// == 获取个人信息 ==
	const getTheUser = async () => {
		let res = await searchUserAPI(localStorage.getItem('userName') as string);
		res.data.data.forEach((r: any) => {
			console.log('r.userName===>', r.userName);
			console.log('TheUserInfo.userName===>', TheUserInfo.userName);
			if (r.userName === TheUserInfo.userName) {
				const { userName, sex, phoneNumber, explain } = r;
				TheUserInfo.userName = userName;
				TheUserInfo.sex = sex;
				TheUserInfo.phoneNumber = phoneNumber;
				TheUserInfo.explain = explain;
				TheUserInfoBefore = JSON.parse(JSON.stringify(TheUserInfo));
				console.log('TheUserInfoBefore======>', TheUserInfoBefore);
				centerDialogVisible.value = true;
			}
		});
	};
	let isEqual = ref(true);
	// == 修改个人信息 ==
	const editTheUser = async () => {
		let ArrBefore = Object.values(TheUserInfoBefore);
		let ArrAfter = Object.values(TheUserInfo);
		for (let i = 0; i < ArrBefore.length; i++) {
			// 只要有不相等的,就去调用
			if (ArrBefore[i] !== ArrAfter[i]) {
				let res = await editInfoAPI(TheUserInfo);
				console.log('res', res);

				centerDialogVisible.value = false;
				isEqual.value = false;
				showUserInfo.value = !showUserInfo.value;
				ElMessage({
					message: '修改成功',
					type: 'success',
					offset: 200,
				});
			}
		}
		// 如果都相等,就不做任何操作
		if (isEqual.value) {
			centerDialogVisible.value = false;
			showUserInfo.value = !showUserInfo.value;
		}
	};
	// == 修改头像 ==
	const handleAvatarSuccess: UploadProps['onSuccess'] = async (response, uploadFile) => {
		response = await JSON.parse(
			CryptoJS.AES.decrypt(response, VITE_SECRECT_KET).toString(CryptoJS.enc.Utf8)
		);
		if (response.code === 200) {
			ElMessage({
				type: 'success',
				message: '上传头像成功',
			});
		} else {
			ElMessage({
				type: 'warning',
				message: '上传头像失败',
			});
		}
		// == 重新获取头像链接 ==
		const avatar = response.response.avatar;
		localStorage.setItem('avatar', avatar);
		imageUrl.value = `http://localhost:1234/user/avators/${avatar}`;
	};
	// == 验证文件格式、大小 ==
	const beforeAvatarUpload: UploadProps['beforeUpload'] = async (rawFile) => {
		// == 先判断 ==
		if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
			ElMessage.error('头像文件格式必须为JPG/PNG');
			return false;
		} else if (rawFile.size / 1024 / 1024 > 2) {
			ElMessage.error('头像文件大小必须小于2MB');
			return false;
		}
		return true;
	};

	// == 修改密码 ==
	const patch = async () => {
		showPatchPwd.value = !showPatchPwd.value;
		const { realPassword } = form;

		const userInfo = {
			userName: localStorage.getItem('userName') as string,
			passWord: realPassword,
		};
		if (form.password === form.realPassword) {
			const res = await patchAPI(userInfo);
			if (res.data.code !== 200) {
				ElMessage({
					message: h('p', null, [h('span', null, '修改失败')]),
					type: 'error',
					duration: 1500,
					center: true,
					offset: 200,
				});
			} else {
				ElMessage({
					message: h('p', null, [h('span', null, res.data.message)]),
					type: 'success',
					duration: 1500,
					center: true,
					offset: 200,
				});
			}
		} else {
			ElMessage({
				message: h('p', null, [h('span', null, '请确认两次密码一致')]),
				type: 'warning',
				duration: 1500,
				center: true,
				offset: 200,
			});
		}
	};

	// == 搜索用户 ==
	const searchUser = async () => {
		let res = await searchUserAPI(SearchuserName.value);
		// == 查无此人 ==
		if (res.data.code === 404) {
			SearchNoData.value = true;
			drawer.value = !drawer.value;
		} else if (res.data.code === 200) {
			// == 找到 ==
			SearchData.value = Object.assign(SearchData.value, res.data.data);
			drawer.value = !drawer.value;
		}
		SearchuserName.value = '';
	};
	// == 监视两次密码是否一致 ==
	const showInputInfo = ref(true);

	// == 修改用户状态  ==
	const changeStatus = async (index: number) => {
		const Prestatus = UserStatusList[index].Statutitle;
		// 如果不等于才去请求
		if (Prestatus !== NowStaus.value) {
			let task = await changeStatusAPI({
				userName: NowUserName.value as string,
				status: UserStatusList[index].Statutitle,
			});
			if (task.data.code === 200) {
				// 修改成功
				NowStaus.value = UserStatusList[index].Statutitle;
				updateUserStatus.value = false;
			}
		} else {
			updateUserStatus.value = false;
			// 如果就为当前状态,就不做操作
			return;
		}
	};
	watch(
		[() => form.password, () => form.realPassword],
		() => {
			if (form.password.length > 0) {
				if (form.password === form.realPassword) {
					showInputInfo.value = true;
				} else {
					showInputInfo.value = false;
				}
			} else {
				showInputInfo.value = true;
			}
		},
		{
			immediate: false,
			deep: false,
		}
	);
	watch(
		() => {
			showPatchPwd.value;
		},
		() => {
			if (showPatchPwd.value === false) {
				form.password = '';
				form.realPassword = '';
			}
		},
		{
			immediate: false,
			deep: true,
		}
	);

	onMounted(() => {
		// == 获取用户信息 ==
		if (state().avatar) {
			imageUrl.value = `http://localhost:1234/user/avators/${state().avatar}`;
		}

		document.addEventListener('click', (e) => {
			if (e && showUserInfo.value === true) {
				const Avatar = document.getElementsByTagName('img')[0]; // 获取img
				if (
					e.target !== showToast.value &&
					e.target !== Avatar &&
					e.target !== pathPwd.value &&
					e.target !== statu.value &&
					e.target !== eidt.value &&
					e.target !== name.value &&
					e.target !== birth.value &&
					e.target !== icon.value &&
					e.target !== UserHeader.value &&
					e.target !== UserHeaderImg.value &&
					e.target !== username.value &&
					e.target !== userstatu.value
				) {
					e.stopPropagation();
					showUserInfo.value = false;
				}
			}
		});
	});
</script>

<template>
	<div class="header">
		<!-- 头像以及状态 -->
		<div class="header-left">
			<el-avatar @click="editTheUserInfo" shape="square" :size="30" :src="imageUrl" />
			<span class="header-left-arrow">|</span>

			<el-tooltip :visible="showTip" :showArrow="false" :offset="2">
				<template #content>
					<span>{{ NowStaus }}</span>
				</template>
				<div
					class="header-left-state"
					@click="updateUserStatus = true"
					@mouseenter="showTip = true"
					@mouseleave="showTip = false"
				>
					<span v-for="(icon, index) of UserStatusList" :key="index" class="UerInfo-statu-icon">
						<component v-if="icon.Statutitle === NowStaus" :is="icon.component"></component>
					</span>
					{{ NowStaus }}
				</div>
			</el-tooltip>
		</div>

		<!-- 搜索 -->
		<div class="header-center">
			<el-input
				v-model="SearchuserName"
				class="w-50 m-2"
				size="small"
				placeholder="Enter键搜索"
				@change="searchUser"
				:prefix-icon="Search"
				clearable
			/>
		</div>
		<!-- 自定义窗口功能 -->
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
	<teleport to="body">
		<div ref="showToast" v-show="showUserInfo" class="UerInfo">
			<div ref="UserHeader" class="UerInfo-header">
				<el-upload
					class="avatar-uploader"
					action="http://localhost:1234/user/avator"
					name="avator"
					:auto-upload="true"
					:data="localUserName"
					:show-file-list="false"
					:on-success="handleAvatarSuccess"
					:before-upload="beforeAvatarUpload"
				>
					<img ref="UserHeaderImg" class="UerInfo-header-avator" :src="imageUrl" alt="" />
				</el-upload>

				<div class="UerInfo-header-avator-UserName" ref="username">
					<span ref="name">昵称: {{ NowUserName }}</span>
					<span ref="birth">生日: xxxxxxxx </span>
				</div>
			</div>
			<div class="UerInfo-statu" ref="userstatu">
				<span v-for="(icon, index) of UserStatusList" :key="index" class="UerInfo-statu-icon">
					<component v-show="icon.Statutitle === NowStaus" :is="icon.component"></component>
				</span>
				<span ref="statu" class="UerInfo-statu-text">{{ NowStaus }}</span>
			</div>
			<div class="UerInfo-edit">
				<span ref="eidt" class="UerInfo-edit-text" @click="getTheUser">修改个人信息</span>
			</div>
			<div class="UerInfo-btn">
				<el-button ref="pathPwd" type="primary" @click="showPatchPwd = true">修改密码</el-button>
				<el-button ref="pathPwd" type="primary" @click="closeWin">退出</el-button>
			</div>
		</div>
	</teleport>
	<el-drawer
		v-model="drawer"
		title="搜索结果"
		:direction="direction"
		:before-close="handleClose"
		size="80%"
	>
		<div class="SearchRes-NoData" v-if="SearchNoData"><el-empty description="找不到该用户" /></div>
		<div class="SearchRes" v-if="!SearchNoData">
			<div class="SearchRes-data" v-for="data in SearchData" :key="Number(data.id)">
				<div class="SearchRes-data-top">
					<div>
						<img
							class="SearchRes-data-avatar"
							:src="
								data.avatar ? `${BASEURL}${data.avatar}` : `https://www.kangsang666.top/logo.png`
							"
							alt=""
						/>
					</div>
					<div class="SearchRes-data-biography">
						<h4 class="SearchRes-data-username">{{ data.userName }}</h4>
						<span class="SearchRes-data-explain">{{
							data.explain.length > 10 ? data.explain.slice(0, 10) + '...' : data.explain
						}}</span>
					</div>
				</div>
				<div class="SearchRes-data-bot">
					<el-button type="primary">添加好友</el-button>
					<el-button type="success" color="#fff">发送消息</el-button>
				</div>
			</div>
		</div>
	</el-drawer>
	<!-- 修改密码弹窗 -->
	<el-dialog
		v-model="showPatchPwd"
		title="修改用户密码"
		draggable
		:open-delay="500"
		:close-delay="200"
	>
		<el-form :model="form">
			<el-form-item label="新密码" :label-width="formLabelWidth">
				<el-input type="password" v-model="form.password" autocomplete="off" />
			</el-form-item>
			<el-form-item label="再次输入密码" :label-width="formLabelWidth">
				<el-input type="password" v-model="form.realPassword" autocomplete="off" />
				<div class="inputInfo" v-show="!showInputInfo">
					<span>两次输入密码不一致</span>
					<div class="IconRound">
						<el-icon>
							<CloseBold />
						</el-icon>
					</div>
				</div>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="showPatchPwd = false">取消</el-button>
				<el-button type="primary" @click="patch">确认</el-button>
			</span>
		</template>
	</el-dialog>
	<!-- 修改昵称 -->
	<el-dialog v-model="centerDialogVisible" title="修改个人信息" width="35%" align-center draggable>
		<div class="editUserInfo">
			<div class="editUserInfo-item">
				<span class="editUserInfo-item-attr">昵称</span>
				<el-input v-model="TheUserInfo.userName" />
			</div>
			<div class="editUserInfo-item">
				<span class="editUserInfo-item-attr">性别</span>
				<el-input v-model="TheUserInfo.sex" />
			</div>
			<div class="editUserInfo-item">
				<span class="editUserInfo-item-attr">手机号</span>
				<el-input v-model="TheUserInfo.phoneNumber" />
			</div>
			<div class="editUserInfo-item">
				<span class="editUserInfo-item-attr">个性签名</span>
				<el-input v-model="TheUserInfo.explain" />
			</div>
		</div>
		<template #footer center="false">
			<span class="dialog-footer">
				<el-button @click="centerDialogVisible = false" size="large">取消</el-button>
				<el-button type="primary" @click="editTheUser" size="large"> 确定 </el-button>
			</span>
		</template>
	</el-dialog>
	<!-- 修改用户状态 -->
	<el-dialog v-model="updateUserStatus" title="我的状态" width="31%" align-center draggable>
		<div class="UserStatus">
			<div
				class="UserStatus-statu defaultStatus"
				:class="{ activeStatus: activeIndex === index }"
				ref="UserStatu"
				@mouseenter="changeBgColor(index)"
				v-for="(ele, index) in UserStatusList"
				:key="index"
			>
				<component :is="ele.component"></component>
				<span>{{ ele.Statutitle }}</span>
				<div class="editTheStatus" v-show="activeIndex === index" @click="changeStatus(index)">
					设置
				</div>
			</div>
		</div>
	</el-dialog>
</template>

<style lang="less" scoped>
	:deep(.el-input) {
		margin-top: 5px;
		height: 30px;
	}

	:deep(.el-input__wrapper) {
		font-size: 14px;
	}

	:deep(.el-dialog__body) {
		padding: 0;
	}
	:deep(.el-drawer.ttb) {
		width: 65vw;
	}
	.activeStatus {
		background-image: 'linear-gradient(to left,#23b9fe, #2cc7ff)';
		color: #fff;
	}
	.defaultStatus {
		background-image: none;
		color: #000;
	}
	.IconRound {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		color: #fff;
		background-color: #ef4444;
		margin-left: 5px;
	}

	.inputInfo {
		margin-top: 10px;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		width: 100%;
		height: 30px;
		line-height: 30px;
		color: #f56c6c;
		font-size: 16px;
	}

	.UerInfo {
		width: 240px;
		height: 210px;
		background-color: #fff;
		position: absolute;
		z-index: 999;
		box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
		top: 50px;
		left: 8px;

		&-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 60px;
			padding: 10px;

			&-avator {
				flex: 3;
				border-radius: 10px;
				width: 40px;
				height: 40px;

				&-UserName {
					flex: 7;
					display: flex;
					height: 60px;
					flex-direction: column;
					justify-content: space-around;
					align-items: flex-start;
					margin-left: 20px;
				}
			}
		}

		&-statu {
			cursor: pointer;
			width: 85%;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			height: 28px;
			margin: 0 auto;
			border-radius: 3px;
			padding: 0px 5px;
			border: 1px solid #eee;
			font-size: 14px;

			&-text {
				margin-left: 6px;
			}
			&-icon {
				svg {
					width: 20px;
					height: 35px;
					vertical-align: middle;
					margin-right: 5px;
				}
			}
		}

		&-edit {
			cursor: pointer;
			width: 85%;
			margin: 0 auto;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			height: 40px;
			border-bottom: 1px solid #eee;
			margin-bottom: 10px;

			&-text {
				cursor: pointer;
				width: 100%;
				height: 30px;
				line-height: 30px;
				border-radius: 5px;
				padding: 0 5px;

				&:hover {
					background-color: #dedfe0;
				}
			}
		}

		&-btn {
			width: 85%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin: 0 auto;
		}
	}

	.header {
		position: relative;
		-webkit-app-region: drag;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 50px;
		padding: 0 15px;
		background: linear-gradient(to right, #394a6a, #394a6a);

		&-left {
			-webkit-app-region: no-drag;
			width: 130px;
			display: flex;
			align-items: center;
			justify-content: space-between;

			&-arrow {
				vertical-align: middle;
				color: #999;
			}

			&-state {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				cursor: pointer;
				width: 80px;
				height: 35px;
				line-height: 35px;
				text-align: center;
				font-size: 13px;
				border-radius: 5px;
				color: #fff;

				&:hover {
					background-color: #2e7acb;
				}
			}
		}

		&-center {
			-webkit-app-region: no-drag;
			width: 400px;
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
				border-radius: 5px;

				&:hover {
					background-color: #4a9df8;
				}
			}
		}
	}

	.SearchRes {
		width: 100%;
		height: 100%;
		display: grid;
		grid-template-columns: repeat(3, 18%);
		grid-gap: 0px 15%;

		&-data {
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			align-items: center;
			flex-direction: column;
			width: fit-content;
			height: fit-content;
			background-color: #1c1419;
			color: #fff;
			padding: 20px 20px 10px 20px;
			transition: 0.3s;
			&:hover {
				transform: translateY(-5px);
			}

			&-top {
				width: 100%;
				display: flex;
				align-content: center;
			}

			&-avatar {
				width: 60px;
				height: 60px;
				border-radius: 50%;
				margin-right: 10px;
				border: 2px solid #ffffff;
			}

			&-biography {
				height: 100%;
				display: flex;
				justify-content: center;
				align-items: flex-start;
				flex-direction: column;
			}

			&-username {
				text-align: left;
				color: #fff;
				font-size: 26px;
				margin: 0;
			}

			&-explain {
				font-size: 14px;
				color: #e5e9ef;
			}

			&-bot {
				width: 100%;
				height: 60px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 20px;
			}
		}

		&-NoData {
			width: 100%;
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}

	.editUserInfo {
		height: 40vh;
		padding: 20px;

		&-item {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: flex-start;
			width: 100%;
			height: 20%;
			margin-bottom: 20px;
		}
	}

	.UserStatus {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-template-rows: 160px;
		height: 60vh;
		background-color: #f2f2f6;
		padding: 5px;

		&-statu {
			cursor: pointer;
			height: 150px;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			flex-direction: column;
			margin: 5px;
			padding-top: 30px;
			background-color: #fff;
			border-radius: 15px;
			transition: 0.3s;
			box-sizing: border-box;
			&:hover {
				background-color: #dfe1e5;
			}
		}
		.editTheStatus {
			width: 80%;
			height: 40px;
			line-height: 40px;
			margin-top: 8px;
			text-align: center;
			background-color: #4e8cee;
			color: #fff;
		}
	}
</style>
