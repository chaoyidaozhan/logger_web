<template>
    <div 
        class="logger-container" 
        v-loading="{
            loading: loaded, 
            text: $t('status.loading')
        }">
        <fs-sign-menu ref="menu" v-if="loaded"/>
        <router-view v-if="hasGetUserInfo"/>
    </div>
</template>
<script>
import FsSignMenu from 'app_component/menu'
console.log(123)
export default {
    data() {
        return {
            loaded: false, // 是否loading成功
            hasGetUserInfo: false, // 是否成功获取用户信息
            token: ''
        }
    },
    components: {
        FsSignMenu,
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
        getUserInfo() { // 获取用户信息
            this.$ajax({
                url: '/main/getUserInfo',
                type: 'get',
                success: (res)=>{
                    if(res && res.code === 0) {
                        res.data.token = this.token;
                        this.$store.dispatch('update_userinfo', { //登录成功更新store
                            userInfo: res.data || {}
                        });
                        this.hasGetUserInfo = true;
                        this.$eventbus.$emit('checkLimit');
                    } else {
                        this.$eventbus.$emit('checkLimit');
                        this.$Message.warning((res && res.msg) || this.$t('status.networkError'));
                    }
                    this.loaded = true;
                },
                error: (res)=>{
                    console.log(res)
                    this.loaded = true;
                    this.$Message.error((res && res.msg) || this.$t('status.networkError'));
                }
            });
        },
        init() {
            this.setToken()
            this.getUserInfo()
        }
    },
    created() {
        this.init()
    }
}
</script>
<style lang="less" scoped>
@import '../assets/css/var.less';
.logger-container {
    width: 100%;
    height: 100%;
    padding-left: 200px;
    position: relative;
    overflow: auto;
    background-color: @white-color;
}
</style>


