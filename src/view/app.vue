<template>
    <div :class="{'no-padding-logger-container': ($router.currentRoute.path == '/GroupTemplate'), 'logger-container': true}">
        <fs-sign-menu ref="menu" v-if="hasGetUserInfo && $router.currentRoute.path != '/GroupTemplate'"/>
        <router-view v-if="hasGetUserInfo"/>
    </div>
</template>
<script>
    import FsSignMenu from 'app_component/menu'
    // import globalModal from 'app_component/business/query/globalModal'
    export default {
        components: {
            FsSignMenu,
            // globalModal
        },
        data() {
            return {
                hasGetUserInfo: false, // 是否成功获取用户信息
                token: ''
            }
        },
        watch: {
            '$route': function (to, from) { // 路由权限控制
                this.$eventbus.$emit('checkLimit', to, from)
            }
        },
        methods: {
            setToken() { // 设置token
                let $sign = {
                    token: this.$route && this.$route.query && this.$route.query.token
                }
                storage.set('$sign', $sign)
                this.token = $sign.token
            },
            getUserInfo() { // 获取用户信息
                this.$YYLoading.show()
                this.$ajax({
                    url: '/main/getUserInfo',
                    type: 'get',
                    success: (res)=>{
                        if(res && res.code === 0) {
                            res.data.token = this.token
                            this.$store.dispatch('update_userinfo', { //登录成功更新store
                                userInfo: res.data || {}
                            })
                            this.hasGetUserInfo = true
                            this.$eventbus.$emit('checkLimit')
                        } else {
                            this.$eventbus.$emit('checkLimit')
                            this.$YYMessage.warning((res && res.msg) || this.$t('status.networkError'))
                        }
                        this.$YYLoading.hide()
                    },
                    error: (res)=>{
                        this.$YYLoading.hide()
                        this.$YYMessage.error((res && res.msg) || this.$t('status.networkError'))
                    }
                })
            },
            setPswpBtns() {
                const titles = {
                    'Zoom in/out': {
                        en: 'Zoom in/out',
                        zhs: '放大/缩小',
                        zht: '放大/縮小'
                    },
                    'Close (Esc)': {
                        en: 'Close (Esc)',
                        zhs: '关闭 （ESC）',
                        zht: '關閉 （ESC）'
                    },
                    'Previous (arrow left)': {
                        en: 'Previous (arrow left)',
                        zhs: '上一张',
                        zht: '上一張'
                    },
                    'Next (arrow right)': {
                        en: 'Next (arrow right)',
                        zhs: '下一张',
                        zht: '下一張'
                    },
                    default: 'none'
                }
                let pswpBtns = document.querySelectorAll('.pswp__button')
                if(pswpBtns && pswpBtns.length) {
                    pswpBtns.forEach(e=>{
                        const key = e.title
                        e.title = titles[key] && titles[key][this.lang] || titles.default
                    })
                }
            },
            init() {
                this.setToken()
                this.getUserInfo()
            }
        },
        created() {
            this.init()
        },
        mounted () {
            this.setPswpBtns()            
        }
    }
</script>
<style lang="less" scoped>
    @import '~app_assets/css/var.less';
    .logger-container {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding-left: @max-menu-width;
        position: relative;
        overflow: auto;
        background-color: white;
        @media screen and (max-width: 1400px) {
            padding-left: @min-menu-width;
        }
    }
</style>
<style>
.ivu-modal-wrap{
    z-index: 9999!important;
}
.ivu-modal-mask {
    background-color: rgba(55, 55, 55, 0.6);
}
.no-padding-logger-container {
    padding-left: 0!important;
}
</style>


