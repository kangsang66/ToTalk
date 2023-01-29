import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
const routes: RouteRecordRaw[] = [
	{
		path: '/',
		redirect: '/login', // 首次进入路由路径
	},
	{
		path: '/login',
		component: () => import('../pages/login.vue'),
	},
	{
		path: '/Home',
		children: [
			{
				path: '/Home/chat',
				name: 'chat',
				component: () => import('../components/chat.vue'),
			},
			{
				path: '/Home/calendar',
				name: 'calendar',
				component: () => import('../components/calendar.vue'),
			},
			{
				path: '/Home/todoList',
				name: 'todoList',
				component: () => import('../components/todoList.vue'),
			},
		],
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

export default router;
