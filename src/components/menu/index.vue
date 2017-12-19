<template>
    <div class="signin-menu">
        <div class="signin-menu-logo">
            <i class="icon-signin-logo"></i><span>日志</span>
        </div>
        <div class="signin-menu-layout" ref="signinMenuLayout">
            <Menu ref="signinMenu" :active-name="activeName" width="auto" :open-names="openNames" @on-select="goToLink" @on-open-change="initScroll">
                <div v-for="(item, index) in menus" :key="index">
                    <MenuItem :name="item.path" v-if="!item.subMenu">
                        <i v-if="item.icon" :class="`icon-${item.icon}`"></i>
                        <span>{{item.name}}</span>
                    </MenuItem>
                    <Submenu :name="item.name" v-if="item.subMenu && !!item.subMenu.length">
                            <template slot="title">
                                <i v-if="item.icon" :class="`icon-${item.icon}`"></i>
                                <span>{{item.name}}</span>
                            </template>

                            <MenuItem v-for="(val, index) in item.subMenu" :name="val.path" :key="index">
                                {{val.name}}
                            </MenuItem>
                    </Submenu>
                </div>
            </Menu>
        </div>
    </div>
</template>
<script>
import menus from './menuConfig';
import Ps from 'perfect-scrollbar';

export default {
    data() {
        return {
            openNames: [],
            activeName: '/MyCheckin',
            menus: []
        }
    },
    methods: {
        initMenu() { // 初始化导航菜单
            let userInfo = this.$store.state.userInfo;
            let menuParams = {
                deptManager:  userInfo && userInfo.deptManager, // 部门管理员
                signinAdmin:  userInfo && userInfo.signinAdmin, // 签到管理员
                attendanceAdmin:  userInfo && userInfo.attendanceAdmin, // 考勤管理员
                identity:  userInfo && userInfo.identity // 考勤管理员
            }
            this.menus = [];
            if(menus) {
                menus.forEach((item)=>{
                    if(item.type) {
                        for(let i = 0; i < item.type.length; i++) {
                            if(!!menuParams[item.type[i]]) {
                                this.menus.push(item);
                                return false;
                            }
                        }
                    } else {
                        this.menus.push(item);
                    }
                });
                this.initScroll()
            }
        },
        initScroll() {
            this.$nextTick(()=>{
                let container = this.$refs.signinMenuLayout;
                Ps.destroy(container);
                Ps.initialize(container, {
                    wheelSpeed: 0.5,
                    wheelPropagation: false,
                    useBothWheelAxes: true,
                    eventPassthrough : 'horizontal',
                    minScrollbarLength: 60,
                    maxScrollbarLength: 300
                });
            })
        },
        setOpenNames() { // 设置展开状态
            if(this.menus && this.menus.length) {
                this.menus.forEach((item)=>{
                    if(item.subMenu && !!item.subMenu.length) {
                        item.subMenu.forEach((sub)=>{
                            if(sub.path == this.activeName) {
                                this.openNames.push(item.name);
                            }
                        })
                    }
                });
            }
        },
        setActiveName(to) { // 设置当前激活导航
            let path = to ? to.path : this.$route && this.$route.path;
            let reg = /\/([^\/]*)(\/ | ?)/g;
            if(reg.exec(path)){
                this.activeName = `/${RegExp.$1}`
            } else {
                this.activeName = path
            }
            this.setOpenNames();
        },
        checkLimit(to, from) { // 检测当前路由权限
            let path = to ? to.path : this.$route.path;
            let menus = this.menus;
            let exist = false;
            menus.forEach((m)=>{
                if(m.path && path.indexOf(m.path) != -1) { // 存在
                    exist = true;
                }
                if(m.subMenu && !!m.subMenu.length) {
                    m.subMenu.forEach((s)=>{
                        if(s.path && path.indexOf(s.path) != -1) { // 存在
                            exist = true;
                        }
                    })
                }
            });
            // 没在nemuconfig中注册的地址
            let otherPaths = ['/SettingAuthor'];
            try{
                if( otherPaths.includes(to.path) ){
                    exist = true ;
                }
            }catch(e){}

            if(!exist) { // 如果不存在当前路由跳转回from或mycheckin
                // this.goToLink(from ? from.path : '/MyCheckin');
            }
            this.setActiveName(to || null);
        },
        goToLink(name) { // 跳转
            this.$router.push({
                path: name,
                query: {
                    token: (storage.get('$sign') && storage.get('$sign').token) || this.$store.state.userInfo.token
                }
            });
        },
        init() {
            this.initMenu();
            this.checkLimit();
            this.setActiveName();
        }
    },
    created () {
        this.init();
    },
    mounted () {
        this.$eventbus.$on('checkLimit', (to, from)=>{ // 定义全局
            this.checkLimit(to, from);
        })
    },
    destroyed () {
        this.$eventbus.$off('checkLimit')
    }
}
</script>
<style lang="less">
@import '../../assets/css/var.less';
.signin-menu {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 200px;
    border-right: 1px solid @menu-border-color;
    background-color: @menu-bg-color;
        ::selection {
        background-color: transparent!important;
    }
    .signin-menu-layout {
        position: absolute;
        top: 86px;
        bottom: 0;
        overflow: hidden;
        right: 0;
        left: 0;
        padding-bottom: 20px;
    }
    .signin-menu-logo {
        color: @primary-color;
        padding: 28px 0;
        text-align: center;
        height: 86px;
        i {
            font-size: 30px;
            margin-right: 8px;
            display: inline-block;
            vertical-align: middle;
        }
        span {
            font-size: 20px;
            display: inline-block;
            vertical-align: middle;
        }
    }
    .ivu-menu-light {
        background-color: transparent;
    }
    .ivu-menu-vertical {
        &:after {
            display: none!important;
        }
        .ivu-menu-item,
        .ivu-menu-submenu-title {
            padding: 17px 24px;
            font-size: 14px;
            line-height: 14px;
            color: @menu-title-color;
            border-right: 0;
            &:hover {
                background-color: rgba(55, 183, 253, .1);
                color: @primary-color;
            }
            &.ivu-menu-item-active,
            &.ivu-menu-item-selected {
                background-color: @primary-color;
                color: @menu-color!important;
                border-right: 0!important;
            }
            &>i {
                font-size: 18px;
                margin-right: 4px;
                vertical-align: middle;
                width: 18px;
                height: 18px;
                display: inline-block;
            }
            &>span {
                vertical-align: middle;
                display: inline-block;
            }
        }
        .ivu-menu-submenu .ivu-menu-item {
            padding-left: 50px;
        }
        .ivu-menu-submenu-title-icon {
            top: 0;
        }
    }
}
</style>
