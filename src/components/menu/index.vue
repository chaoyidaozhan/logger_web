<template>
    <div class="logger-menu">
        <div class="logger-menu-logo">
            <Button type="primary" @click="goLoggerDetail" :style="{width: '100px'}">
                {{$t('operate.createLog')}}
            </Button>
        </div>
        <div class="logger-menu-layout" ref="loggerMenuLayout">
            <Menu ref="loggerMenu" :active-name="activeName" width="auto" :open-names="openNames" @on-select="goToLink" @on-open-change="initScroll">
                <div v-for="(item, index) in menus" :key="index">
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
                                :key="index">
                                {{$t(val.name)}}
                            </Menu-Item>
                    </Submenu>
                </div>
            </Menu>
        </div>
    </div>
</template>
<script>
import menus from './menuConfig'
import Ps from 'perfect-scrollbar'

export default {
    data() {
        return {
            openNames: [],
            activeName: '',
            menus: []
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
                            if(item.showConfig && !menuLimits.showConfig) return
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
                let container = this.$refs.loggerMenuLayout
                Ps.destroy(container);
                Ps.initialize(container, {
                    wheelSpeed: 0.5,
                    wheelPropagation: false,
                    useBothWheelAxes: true,
                    eventPassthrough : 'horizontal',
                    minScrollbarLength: 60,
                    maxScrollbarLength: 300
                })
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
        init() {
            this.initMenu()
            this.checkLimit()
            this.setActiveName()
        }
    },
    created () {
        this.init()
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
@import '../../assets/css/var.less';

.logger-menu {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 200px;
    border-right: 1px solid #d0d0d0;
    background-color: @white-color;

    ::selection {
        background-color: transparent !important;
    }

    .ps.ps--active-x>.ps__scrollbar-x-rail,
    .ps.ps--active-y>.ps__scrollbar-y-rail {
        z-index: 999;
    }

    .logger-menu-layout {
        position: absolute;
        top: 86px;
        bottom: 0;
        overflow: hidden;
        right: 0;
        left: 0;
        padding-bottom: 20px;
    }

    .logger-menu-logo {
        color: @primary-color;
        padding: 28px 0;
        text-align: center;
        height: 86px;

        span {
            font-size: 14px;
            display: inline-block;
            vertical-align: middle;
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
            padding: 17px 20px;
            font-size: 14px;
            line-height: 14px;
            color: @menu-title-color;
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
                width: 18px;
                height: 18px;
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

                &>i {
                    color: @gray-color-dark;
                }
            }

            &.ivu-menu-item-active,
            &.ivu-menu-item-selected {
                background-color: @menu-hover-bg-color;
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
                    background-color: @primary-color
                }
            }
        }

        .ivu-menu-submenu .ivu-menu-item {
            padding-left: 48px;
        }

        .ivu-menu-submenu-title-icon {
            top: 0;
        }
    }
}
</style>
