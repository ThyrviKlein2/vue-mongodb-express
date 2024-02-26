import './style.css';
import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';
import HomeView from './views/Home.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: HomeView },
  ],
});

const app = createApp(App);
app.use(router);
app.mount('#app');
