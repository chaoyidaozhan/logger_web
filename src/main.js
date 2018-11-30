import Vue from 'vue'
import 'es6-promise/auto'
import VueRouter from 'vue-router'
import store from './store/'
import routes from './router/'
import http from './config/http'

// 工具类
import ajax from './common/ajax' // 引入封装过后的ajax
import storage from './common/store.js-master/dist/store.legacy.min'

// 指令
import 'app_src/directives/loading/'

// css文件
import 'video.js/dist/video-js.min.css'
import 'perfect-scrollbar/dist/css/perfect-scrollbar.css'
import './assets/css/common.less'
// 引入ui库
import iView from 'iview'
Vue.use(iView)

import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
const options = {
    history: false,
    bgOpacity: .6,
    closeOnScroll: false,
    closeOnVerticalDrag: false,
    shareEl: false,
    barsSize: {
        top: 0,
        bottom: 0
    },
    showHideOpacity: true,
    showAnimationDuration: 300,
    hideAnimationDuration: 300,
    captionEl: false,
    showAnimationDuration: 200,
    fullscreenEl: false,
}
Vue.use(preview, options)

// 图片预览组件
import VuePreview from 'vue-preview'
console.log(VuePreview);

Vue.use(VuePreview)

// 视频组件
import FsVueVideo from './components/common/video/'
Vue.use(FsVueVideo)

// 选人组件依赖 iview 和 ajax.js ;
import selectTree from './components/common/select-tree'
Vue.use(selectTree)

// 多语
import { i18n, setLocale } from './common/language/'
import { getWebLang } from 'yyzone'

getWebLang({
    callback(lang) {
        setLocale(lang)
        i18n.locale = lang

        Vue.prototype.$eventbus = new Vue(); // 建立组件全局通信的钩子
        Vue.prototype.$ajax = ajax; // 将ajax挂在到vue实例
        window.storage = storage; // 建立全局的storage
        Vue.use(VueRouter);

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
            if ((from.path.indexOf('/LoggerTemplate/operate') != -1 &&
                    to.path.indexOf('/LoggerTemplate/operate') < 0) ||
                (from.path.indexOf('/LoggerDetail/operate/create') != -1 && !window.createComplete)) {
                iView.Modal.confirm({
                    title: i18n.messages[lang].toast.pagePrompt,
                    content: i18n.messages[lang].toast.confirmToLeaveCurrentPage,
                    onOk: () => {
                        iView.LoadingBar.start();
                        next();
                    },
                    onCancel: () => {
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
            i18n,
            store,
            router,
            ajax
        }).$mount('#app');
    }
})
