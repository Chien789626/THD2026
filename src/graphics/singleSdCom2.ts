import { createHead } from '@vueuse/head';
import { createApp } from 'vue';
import App from './singleSDCom2/main.vue';

const app = createApp(App);
const head = createHead();
app.use(head);
app.mount('#app');
