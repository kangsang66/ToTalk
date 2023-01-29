import { createPinia } from 'pinia';
import router from './router/index.js';

// import 'element-plus/es/components/message/style/css';
import 'element-plus/dist/index.css';
import './style/normalize.css';
const pinia = createPinia();
import App from './App.vue';

createApp(App).use(router).use(pinia).mount('#app');
