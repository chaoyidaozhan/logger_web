<template>
    <div class="signin-container" v-loading="{loading: loaded, text: '加载中...'}">
        <fs-sign-menu ref="menu" v-if="loaded"></fs-sign-menu>
        <router-view v-if="hasGetUserInfo"></router-view>
    </div>
</template>
<script>
import FsSignMenu from 'app_component/menu';
import FsFirstAccess from '../components/common/first-access';
import menus from '../components/menu/';
import '../directives/loading/';

export default {
    data() {
        return {
            loaded: false, // 是否loading成功
            hasGetUserInfo: false, // 是否成功获取用户信息
            token: '',
            isFirstAccess: false // 用户是否是第一次进入
        }
    },
    components: {
        FsSignMenu,
        FsFirstAccess
    },
    watch: {
        '$route': function (to, from) { // 路由权限控制
            this.$eventbus.$emit('checkLimit', to, from);
        }
    },
    methods: {
        setToken() { // 设置token
            let $sign = {
                token: this.$route && this.$route.query && this.$route.query.token
            }
            storage.set('$sign', $sign);
            this.token = $sign.token;
        },
        getSignTips() { // 用户是否开启人脸识别
            this.$ajax({
                url: '/signin/signinTips/identity',
                success: (res)=>{
                    if(res && res.code === 0) {
                        this.$store.dispatch('update_userinfo', { // 获取人脸识别更新store
                            userInfo: {
                                identity: res.data.identity || 0,
                                ...this.$store.state.userInfo, 
                            }
                        });
                        if(!!res.data.identity) {
                            this.$refs.menu.init();
                        }
                    } 
                }
            })
        },
        getUserInfo() { // 获取用户信息
            this.$ajax({
                url: '/signin/attentance/getUserInfo',
                type: 'get',
                success: (res)=>{
                    if(res && res.code === 0) {
                        res.data.token = this.token;
                        this.$store.dispatch('update_userinfo', { //登录成功更新store
                            userInfo: res.data || {}
                        });
                        this.isFirstAccess = res.data.isFirstAccess;
                        this.hasGetUserInfo = true;
                        this.$eventbus.$emit('checkLimit');
                        this.getSignTips();
                    } else {
                        this.$eventbus.$emit('checkLimit');
                        this.$Message.warning((res && res.msg) || '网络错误');
                    }
                    this.loaded = true;
                },
                error: (res)=>{
                    this.loaded = true;
                    this.$Message.error((res && res.msg) || '网络错误');
                }
            });
        },
        init() {
            this.setToken();
            this.getUserInfo();
        },
    },
    created() {
        this.init();
       
    }
}
</script>
<style lang="less" scoped>
    .signin-container {
        width: 100%;
        height: 100%;
        padding-left: 200px;
        position: relative;
    }
</style>


