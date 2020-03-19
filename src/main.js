import Vue from 'vue'
import 'es6-promise/auto'
import VueRouter from 'vue-router'
import iView from 'iview'
import preview from 'vue-photo-preview'
import store from './store/'
import routes from './router/'
import http from './config/http'
import './config/jDiwork'
import ajax from './common/ajax' // 引入封装过后的ajax
import storage from './common/store.js-master/dist/store.legacy.min'
import { i18n, setLocale } from './common/language/'
import { locale } from 'yyzone/src/locale/'
import { getWebLang } from 'yyzone/src/utils/lang'
import FsVueVideo from './components/common/video/'
import selectTree from './components/common/select-tree'
import 'app_src/directives/loading/'
import yyzone from 'yyzone'
import axios from 'axios'
axios.defaults.withCredentials = true

// css文件
import 'video.js/dist/video-js.min.css'
import 'perfect-scrollbar/css/perfect-scrollbar.css'
import 'yyzone/dist/styles/yyzone.min.css'
import './assets/css/common.less'
import 'vue-photo-preview/dist/skin.css'
import './assets/css/flex.less'

const options = { // 图片预览插件配置
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
Vue.use(iView)
Vue.use(VueRouter)
Vue.use(preview, options)
Vue.use(FsVueVideo)
Vue.use(selectTree)
window.storage = storage // 建立全局的storage

getWebLang().then(lang => {
    setLocale(lang)
    i18n.locale = lang
    locale(lang)

    Vue.use(yyzone, {
        locale: lang
    })
    Vue.prototype.$eventbus = new Vue() // 建立组件全局通信的钩子
    Vue.prototype.$ajax = ajax // 将ajax挂在到vue实例
    Vue.prototype.$http = axios // 将 axios 挂在到vue实例

    const router = new VueRouter({ // 创建路由
        mode: 'hash',
        routes
    })

    // 用于创建日志的通信
    window.createComplete = false
    router.beforeEach((to, from, next) => {
        if ((from.path.indexOf('/LoggerTemplate/operate') != -1 &&
                to.path.indexOf('/LoggerTemplate/operate') < 0) ||
            (from.path.indexOf('/LoggerDetail/operate/create') != -1 && !window.createComplete)) {
                yyzone.YYModal.show({
                title: i18n.messages[lang].toast.pagePrompt,
                content: i18n.messages[lang].toast.confirmToLeaveCurrentPage,
                onOk: () => {
                    next()
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
            next()
        }
    })
    new Vue({
        mixins: [http],
        i18n,
        store,
        router,
        ajax
    }).$mount('#app')
})