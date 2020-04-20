<template>
    <div class="logger-menu">
        <!-- <div class="logger-menu-logo">
            <YYButton type="primary" @click="goLoggerDetail">
                {{$t('operate.createLog')}}
            </YYButton>
        </div> -->
        <div class="logger-menu-layout" ref="loggerMenuLayout">
            <Menu ref="loggerMenu"
                :active-name="activeName"
                :class="lang"
                width="auto" :open-names="openNames" @on-select="goToLink" @on-open-change="initScroll">
                <div v-for="(item, index) in menus" :key="index" v-show="item.path != '/GroupTemplate'">
                    <Menu-Item :name="item.path" v-if="!item.subMenu">
                        <i v-if="item.icon" :class="`${item.icon}`"></i>
                        <span>{{$t(item.name)}}</span>
                    </Menu-Item>
                    <Submenu :name="item.name" v-if="item.subMenu && !!item.subMenu.length">
                            <template slot="title">
                                <i v-if="item.icon" :class="`${item.icon}`"></i>
                                <span>{{$t(item.name)}}</span>
                            </template>

                            <Menu-Item 
                                v-for="(val, index) in item.subMenu" 
                                :name="val.path" 
                                :key="index">{{$t(val.name)}}<span v-if="val.path == '/LoggerQueryUnread' && unreadCount">({{unreadCount}})</span>
                            </Menu-Item>
                    </Submenu>
                </div>
            </Menu>
        </div>
    </div>
</template>
<script>
import menus from './menuConfig'
// import Ps from 'perfect-scrollbar';
// let Ps = null;

export default {
    data() {
        return {
            openNames: [],
            activeName: '',
            menus: [],
            unreadCount: 0
        }
    },
    methods: {
        initMenu() { // 初始化导航菜单
            let userInfo = this.$store.state.userInfo
            let menuLimits = {
                admin:  userInfo && userInfo.admin, 
                diary_examer:  userInfo && userInfo.diary_examer, 
                deptManager:  userInfo && userInfo.deptManager,
                showStatistics: userInfo && userInfo.showStatistics,
                showConfig: userInfo && userInfo.showConfig,
            }
            this.menus = []
            if(menus) {
                menus.forEach((item)=>{
                    // 验证一级菜单
                    if(item.type) {
                        for(let i = 0; i < item.type.length; i++) {
                            if(item.showStatistics && !menuLimits.showStatistics) return
                            // if(item.showConfig && !menuLimits.showConfig) return
                            if(!!menuLimits[item.type[i]]) {
                                return this.menus.push(item)
                            }
                        }
                    } else {
                        this.menus.push(item)
                    }
                    // 验证二级菜单
                    if(item.checkChilren) {
                        let subMenu = []
                        item.subMenu.forEach((val)=>{
                            if(val.type) {
                                for(let i = 0; i < val.type.length; i++) {
                                    if(!!menuLimits[val.type[i]]) {
                                        return subMenu.push(val);
                                    }
                                }
                            } else {
                                subMenu.push(val)
                            }
                        })
                        item.subMenu = subMenu
                    }
                });
                this.initScroll()
            }
        },
        initScroll() {
            this.$nextTick(()=>{
                // let container = this.$refs.loggerMenuLayout
                // Ps && Ps.destroy(container);
                // Ps = new PerfectScrollbar(container, {
                //     wheelSpeed: 0.5,
                //     wheelPropagation: false,
                //     useBothWheelAxes: true,
                //     eventPassthrough : 'horizontal',
                //     minScrollbarLength: 60,
                //     maxScrollbarLength: 100
                // })
                // Ps.destroy(container);
                // Ps.initialize(container, {
                //     wheelSpeed: 0.5,
                //     wheelPropagation: false,
                //     useBothWheelAxes: true,
                //     eventPassthrough : 'horizontal',
                //     minScrollbarLength: 60,
                //     maxScrollbarLength: 300
                // })
            })
        },
        setOpenNames() { // 设置展开状态
            if(this.menus && this.menus.length) {
                this.menus.forEach((item)=>{
                    if(item.subMenu && !!item.subMenu.length) {
                        item.subMenu.forEach((sub)=>{
                            if(sub.path == this.activeName) {
                                this.openNames.push(item.name)
                            }
                        })
                    }
                });
            }
        },
        setActiveName(to) { // 设置当前激活导航
            let path = to ? to.path : this.$route && this.$route.path
            this.activeName = path
            if(path.indexOf('LoggerTemplate') != -1) {
                this.activeName = '/LoggerTemplate/manager'
            }
            this.setOpenNames()
        },
        checkLimit(to, from) { // 检测当前路由权限
            let path = to ? to.path : this.$route.path
            let menus = JSON.parse(JSON.stringify(this.menus))

            menus.push({ // 不存在menuconfig中的地址
                path: '/LoggerDetail'
            }, {
                path: '/LoggerTemplate'
            },{
                path: '/globalModal'
            })
            let exist = false;
            menus.forEach((m)=>{
                if(m.path && path.indexOf(m.path) != -1) { // 存在
                    exist = true
                }
                if(m.subMenu && !!m.subMenu.length) {
                    m.subMenu.forEach((s)=>{
                        if(s.path && path.indexOf(s.path) != -1) { // 存在
                            exist = true
                        }
                    })
                }
            });

            if(!exist) { // 如果不存在当前路由跳转回from或mycheckin
                this.goToLink(from ? from.path : '/LoggerQueryAll')
            }
            this.setActiveName(to || null)
        },
        goToLink(name) { // 跳转
            this.setActiveName()
            this.$router.push({
                path: name,
                query: {
                    token: this.$store.state.userInfo.token
                }
            })
        },
        goLoggerDetail() {
            this.$router.push({
                path: `/LoggerDetail/template`,
                query: {
                    token: this.$store.state.userInfo.token
                }
            })
        },
        getUnreadDiaryCount() {
            this.$ajax({
                url: '/diaryQuery/getUnreadDiaryCount',
                success: (res)=>{
                    this.unreadCount = res.data
                }
            })
        },
        init() {
            this.initMenu()
            this.checkLimit()
            this.setActiveName()
            this.getUnreadDiaryCount()
        }
    },
    created () {
        this.init()
        const _this = this
        this.$eventbus.$on('getUnreadCount', ()=>{
            _this.getUnreadDiaryCount()
        })
    },
    mounted () {
        this.$eventbus.$on('checkLimit', (to, from)=>{ // 定义全局
            this.checkLimit(to, from)
        })
    },
    destroyed () {
        this.$eventbus.$off('checkLimit')
    }
}
</script>
<style lang="less">
@import '~app_assets/css/var.less';

.logger-menu {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: @max-menu-width;
    // border-right: 1px solid #dddddd;
    background-color: @white-color;
    // box-shadow: 0 0 20px rgba(0,0,0,.1);
    z-index: 10;
    @media screen and (max-width: 1200px) {
        width: @min-menu-width;
    }
    ::selection {
        background-color: transparent !important;
    }

    .ps.ps--active-x>.ps__scrollbar-x-rail,
    .ps.ps--active-y>.ps__scrollbar-y-rail {
        z-index: 999;
    }

    .logger-menu-layout {
        position: absolute;
        top: 10px;
        bottom: 0;
        overflow-y: auto;
        right: 0;
        left: 0;
        padding-bottom: 20px;
        &::-webkit-scrollbar {
            width: 0;
        }
    }

    .logger-menu-logo {
        color: @primary-color;
        padding: 30px 0 20px;
        text-align: center;
        span {
            font-size: 12px;
        }
    }

    .ivu-menu-light {
        background-color: transparent;
    }

    .ivu-menu-vertical {
        &:after {
            display: none !important;
        }
        .ivu-menu-item,
        .ivu-menu-submenu-title {
            height: 44px;
            padding: 12px 16px;
            font-size: 14px;
            line-height: 20px;
            color: #333;
            border-right: 0 !important;

            

            .icon-collect-normal-2018,
            .icon-statistics-2018,
            .icon-template-2018 {
                font-size: 17px;
            }

            &>i {
                font-size: 16px;
                margin-right: 4px;
                vertical-align: middle;
                width: 16px;
                height: 16px;
                display: inline-block;
                color: @gray-color-light;
            }

            &>span {
                vertical-align: middle;
                display: inline-block;
                width: 65%;
                word-break: break-word;
            }

            &:hover {
                background-color: @menu-hover-color;
                color: @gray-color-dark;
                border-right: 0 !important;
            }

            &.ivu-menu-item-active,
            &.ivu-menu-item-selected {
                // background-color: @menu-hover-bg-color;
                background: linear-gradient(270deg,rgba(255,255,255,1) 0%,rgba(230,233,240,1) 100%) !important;
                border-right: 0 !important;

                &>i {
                    color: @primary-color;
                }

                &:before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 3px;
                    height: 100%;
                    // background-color: @primary-color
                    background:linear-gradient(45deg,rgba(252,76,47,1) 0%,rgba(238,34,35,1) 100%);
                }
                &::after {
                    display: none !important;
                }
            }
        }
        .ivu-menu-item {
            .icon-customized {
                font-size: 24px;
                margin-left: -5px;
                vertical-align: middle;
                margin-top: -5px;
            }
        }
        // .ivu-menu-submenu-title {
        //     padding: 13px 16px;
        // }
        .ivu-menu-submenu .ivu-menu-item {
            height: 36px;
            padding: 10px 0 10px 44px;
            line-height: 16px;
        }

        .ivu-menu-submenu-title-icon {
            // top: 0;
            text-align: center;
            margin-right: -8px !important;
        }
        &.en {
            .ivu-menu-item,
            .ivu-menu-submenu-title {
                line-height: 20px;
                font-size: 13px;
            }
        }
    }
}
</style>
