import Vue from 'vue';
import VueRouter from 'vue-router';
import iView from 'iview'; // 引入ui库
import store from './store/';
import routes from './router/';
import axios from 'axios';
import http from './config/http';
import ajax from './common/ajax'; // 引入封装过后的ajax
import VuePreview from 'vue-preview'
import storage from './common/store.js-master/dist/store.legacy.min';
import 'perfect-scrollbar/dist/css/perfect-scrollbar.css';
import './assets/css/common.less';

Vue.prototype.$eventbus = new Vue(); // 建立组件全局通信的钩子
Vue.prototype.$ajax = ajax; // 将ajax挂在到vue实例
Vue.prototype.$axios = axios; // 将ajax挂在到vue实例
var CancelToken = axios.CancelToken;
var source = CancelToken.source();
Vue.prototype.$source = source; // 将ajax挂在到vue实例

window.storage = storage; // 建立全局的storage

Vue.use(VueRouter);
Vue.use(iView);
Vue.use(VuePreview);

// 选人组件依赖 iview 和 ajax.js ;
import selectMember from './components/common/select-member';
Vue.use(selectMember);

const router = new VueRouter({ // 创建路由
    mode: 'hash',
    routes
});

iView.LoadingBar.config({ // 配置loadingbar
    height: 2
})

router.beforeEach((to, from, next) => {
    if ((from.path.indexOf('/LoggerTemplate/operate') != -1 && to.path.indexOf('/LoggerTemplate/operate') < 0)) {
        iView.Modal.confirm({
            title: '页面提示',
            content: '您确定离开当前页面吗？',
            onOk: ()=>{
                iView.LoadingBar.start();
                next();
            }
        })
    } else {
        iView.LoadingBar.start();
        next();
    }
})

router.afterEach((to, from, next) => { // 路由切换之后
    setTimeout(() => {
        iView.LoadingBar.finish();
    }, 200);
});

new Vue({
    mixins: [http],
    store,
    router,
    ajax
}).$mount('#app');
