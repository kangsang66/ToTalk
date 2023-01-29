<script setup lang="ts">
	import Homeheader from './pages/header.vue';
	import Aside from './pages/aside.vue';
	import Main from './pages/main.vue';
	import Login from './pages/login.vue';
	import { state } from './store/index';
	import { socket } from './socket';
	onUnmounted(() => {
		console.log('离线');

		socket.disconnect();
	});
</script>

<template>
	<!-- <div>2311111</div> -->
	<div class="home">
		<el-container v-if="!state().showLogin">
			<el-header height="50px">
				<Homeheader />
			</el-header>
			<el-container>
				<el-aside width="140px">
					<Aside />
				</el-aside>
				<el-main>
					<Main />
				</el-main>
			</el-container>
		</el-container>
	</div>
	<Login />
</template>

<style lang="less">
	@import url('./style/scrollbar.css');

	.el-main {
		padding: 0px;
		min-width: 600px;
		min-height: 300px;
	}

	.el-header {
		padding: 0px;
	}
	// .el-textarea {
	// 	transform: translateY(-32px);
	// }

	.el-textarea__inner:focus,
	.el-textarea__inner:hover {
		box-shadow: none;
	}
	* {
		padding: 0;
		margin: 0;
	}

	li {
		list-style: none;
	}

	.el-drawer.ttb {
		width: 77%;
		top: 100px;
		margin: 0 auto;
	}

	.el-drawer__header {
		background-image: linear-gradient(60deg, #29323c 0%, #485563 100%);
		padding-bottom: 20px;
		margin-bottom: 0;
		color: #fff;
	}

	.el-drawer__title {
		font-size: 26px;
	}

	.el-drawer__close-btn {
		border-radius: 5px;
	}

	.el-drawer__close-btn:hover {
		background-image: linear-gradient(to top, #c4c5c7 0%, #dcdddf 52%, #ebebeb 100%);
	}

	.el-drawer__body {
		background-image: linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%);
	}

	.el-dialog__header {
		border-bottom: 1px solid #999;
		margin-right: 0;
	}

	.el-dialog__body {
		padding: 0;
	}
</style>
