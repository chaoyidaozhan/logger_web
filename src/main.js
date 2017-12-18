import Vue from 'vue';
import VueRouter from 'vue-router';
import store from './store/';
import routes from './router/';
import axios from 'axios';
import http from './config/http';
import iView from './common/iview/src/'; // 引入ui库
import ajax from './common/ajax'; // 引入封装过后的ajax
import storage from './common/store.js-master/dist/store.legacy.min';
import 'perfect-scrollbar/dist/css/perfect-scrollbar.css';
import './assets/css/common.less';

Vue.prototype.$eventbus = new Vue(); // 建立组件全局通信的钩子
Vue.prototype.$ajax = ajax; // 将ajax挂在到vue实例
window.storage = storage; // 建立全局的storage

Vue.use(VueRouter);
Vue.use(iView);

const router = new VueRouter({ // 创建路由
    mode: 'hash',
    routes
});

new Vue({
    mixins: [http],
    store,
    router,
    ajax
}).$mount('#app');
