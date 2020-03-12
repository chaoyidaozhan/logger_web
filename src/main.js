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

// css文件
import 'video.js/dist/video-js.min.css'
import 'perfect-scrollbar/dist/css/perfect-scrollbar.css'
import 'yyzone/dist/styles/yyzone.min.css'
import './assets/css/common.less'
import 'vue-photo-preview/dist/skin.css'
import './assets/css/flex.less'

// 按需引入YYZone组件
import YYAvatar from 'yyzone/src/components/base/avatar/'
import YYButton from 'yyzone/src/components/base/button/'
import YYEmpty from 'yyzone/src/components/base/empty/'
import YYRadio from 'yyzone/src/components/base/radio/'
import YYCheckbox from 'yyzone/src/components/base/checkbox/'
import YYDatePicker from 'yyzone/src/components/base/date-picker/'
import YYSelect from 'yyzone/src/components/base/select/'
import YYPagination from 'yyzone/src/components/base/pagination/'
import YYLoading from 'yyzone/src/components/base/loading/'
import YYLoadingDirective from 'yyzone/src/directives/loading'
import YYMessage from 'yyzone/src/components/base/message/'
import YYLoadingH from 'yyzone/src/components/base/loading-h/'
import YYModal from 'yyzone/src/components/base/modal/'
import YYDropdown from 'yyzone/src/components/base/dropdown/'
import YYTable from 'yyzone/src/components/base/table/'
import YYDialog from 'yyzone/src/components/base/dialog/'
import YYSwitch from 'yyzone/src/components/base/switch/'
import YYInput from 'yyzone/src/components/base/input/'

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

    Vue.component('YYAvatar', YYAvatar)
    Vue.component('YYButton', YYButton)
    Vue.component('YYDatePicker', YYDatePicker)
    Vue.component('YYEmpty', YYEmpty)
    Vue.component('YYLoading', YYLoading)
    Vue.component('YYRadio', YYRadio)
    Vue.component('YYRadioGroup', YYRadio.YYRadioGroup)
    Vue.component('YYCheckbox', YYCheckbox)
    Vue.component('YYCheckboxGroup', YYCheckbox.YYCheckboxGroup)
    Vue.component('YYPagination', YYPagination)
    Vue.component('YYLoadingH', YYLoadingH)
    Vue.component('YYModal', YYModal)
    Vue.component('YYSelect', YYSelect)
    Vue.component('YYOption', YYSelect.YYOption)
    Vue.component('YYDropdown', YYDropdown)
    Vue.component('YYDropdownMenu', YYDropdown.YYDropdownMenu)
    Vue.component('YYDropdownMenu', YYDropdown.YYDropdownMenu)
    Vue.component('YYTable', YYTable)
    Vue.component('YYDialog', YYDialog)
    Vue.component('YYSwitch', YYSwitch)
    Vue.component('YYInput', YYInput)

    Vue.directive('yyloading', YYLoadingDirective)

    Vue.prototype.$eventbus = new Vue() // 建立组件全局通信的钩子
    Vue.prototype.$ajax = ajax // 将ajax挂在到vue实例
    Vue.prototype.$YYModal = YYModal
    Vue.prototype.$YYLoading = YYLoading
    Vue.prototype.$YYMessage = YYMessage

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
            YYModal.show({
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