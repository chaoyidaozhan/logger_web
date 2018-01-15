import Vue from 'vue';
import VueRouter from 'vue-router';
import iView from 'iview'; // 引入ui库
import store from './store/';
import routes from './router/';
import axios from 'axios';
import http from './config/http';
// 指令
import 'app_src/directives/loading/';
// 工具类
import ajax from './common/ajax'; // 引入封装过后的ajax
import storage from './common/store.js-master/dist/store.legacy.min';
// css文件
import 'video.js/dist/video-js.min.css';
import 'perfect-scrollbar/dist/css/perfect-scrollbar.css';
import './assets/css/common.less';


Vue.prototype.$eventbus = new Vue(); // 建立组件全局通信的钩子
Vue.prototype.$ajax = ajax; // 将ajax挂在到vue实例
window.storage = storage; // 建立全局的storage

Vue.use(VueRouter);
Vue.use(iView);

// 图片预览组件
import VuePreview from 'vue-preview';
Vue.use(VuePreview);

// 视频组件
import FsVueVideo from './components/common/video/index';
Vue.use(FsVueVideo);

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
// 用于创建日志的通信
window.createComplete = false;
router.beforeEach((to, from, next) => {
    if ((from.path.indexOf('/LoggerTemplate/operate') != -1
        && to.path.indexOf('/LoggerTemplate/operate') < 0)
        || (from.path.indexOf('/LoggerDetail/operate/create') != -1 && !window.createComplete)) {
        iView.Modal.confirm({
            title: '页面提示',
            content: '您确定离开当前页面吗？',
            onOk: ()=>{
                iView.LoadingBar.start();
                next();
            },
            onCancel: ()=>{
                router.push({
                    path: from.path,
                    params: from.params,
                    query: from.query
                })
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
