<template>
	<div class="aside">
		<div class="aside-inner">
			<div
				class="aside-inner-function"
				@click="Routejumps(i, title)"
				ref="title"
				v-for="i in Arr"
				:key="i.id"
			>
				<component :Color="Color" :ChangeColor="i.changeColor" :is="i.icon"></component>
				<span class="aside-inner-function-text">{{ i.title }}</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { reactive, shallowRef, ref, onMounted } from 'vue';
	import { useRouter } from 'vue-router';
	import msg from '../components/SVG/msg.vue';
	import calendar from '../components/SVG/calendar.vue';
	import todoList from '../components/SVG/todoList.vue';
	const title = ref<any>(null);

	interface Arr {
		id: number;
		title: string;
		path: string;
		icon: any;
		changeColor: Boolean;
	}
	const Arr = reactive([
		{
			id: 0,
			title: '消息',
			path: '/Home/chat',
			icon: shallowRef(msg),
			changeColor: true,
		},
		{
			id: 1,
			title: '日历',
			path: '/Home/calendar',
			icon: shallowRef(calendar),
			changeColor: false,
		},
		{
			id: 2,
			title: '工作台',
			path: '/Home/todoList',
			icon: shallowRef(todoList),
			changeColor: false,
		},
	]);
	const router = useRouter();
	const Color = '#0089ff'; // 切换颜色
	const Routejumps = (titleObj: Arr, title: any) => {
		title.forEach((t: any) => {
			t.style.backgroundColor = '#ebebeb';
			t.style.color = 'black';
			title[titleObj.id].style.backgroundColor = '#dedfe0';
			title[titleObj.id].style.color = '#0089ff';
		});

		Arr.forEach((i) => {
			i.changeColor = false;
		});
		titleObj.changeColor = !titleObj.changeColor;
		router.push({
			path: titleObj.path,
		});
	};
	onMounted(() => {
		if (title) {
			title.value[0].style.backgroundColor = '#dedfe0';
			title.value[0].style.color = '#0089ff';
		}
	});
</script>

<style scoped lang="less">
	.active-text-color {
		color: '#dedfe0';
	}
	.aside {
		height: calc(100vh - 50px);
		background-color: #ebebeb;
		&-inner {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
			height: auto;
			width: 100%;
			padding-top: 20px;
			&-function {
				box-sizing: border-box;
				cursor: pointer;
				width: 90%;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				height: 40px;
				border-radius: 8px;
				font-size: 14px;
				padding: 5px 10px;
				color: black;
				&-text {
					margin-left: 10px;
				}
			}
		}
	}
</style>
