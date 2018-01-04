<template>
    <div class="table">
        <!-- 表头 -->
        <div class="table-header">
            <div class="fixed-left table-cell ellipsis">
                {{columns.title}}
                <i class="icon icon-fullarrow-left cursor-pointer" v-if="columns.array.length > minLen" @click="scrollTo('left')"></i>
            </div>
            <div class="table-header-content" @scroll="onScroll" ref="headerHorizonal">
                <ul class="table-content">
                    <li class="table-cell" 
                        v-for="(val, index) in columns.array" 
                        :style="{'width': `${100/(columns.array.length > minLen ? minLen : columns.array.length)}%`}"
                        :key="index">
                        {{val}}
                    </li>
                </ul>
            </div>
            <div class="fixed-right table-cell">
                <i class="icon icon-fullarrow-right cursor-pointer" v-if="columns.array.length > minLen" @click="scrollTo('right')"></i>
                {{columns.caption}}
            </div>
        </div>
        <!-- 表身 -->
        <div class="table-body" v-if="!!data.length" ref="vertical" :style="{'height': `${height}px`}">
            <div class="fixed-left">
                <ul class="fixed-left-content">
                    <li class="table-cell ellipsis" v-for="(item, index) in data" :key="index">
                        {{item[`${type == 'member' ? 'user' : type}Name`]}}
                    </li>
                </ul>
            </div>
            <div class="table-body-content" @scroll="onScroll" ref="bodyHorizonal">
                <ul class="table-content" v-for="(item, index) in data" :key="index">
                    <li class="table-cell" 
                        :class="{nodata: !val}"
                        v-for="(val, index) in item.array" 
                        :style="{'width': `${100/(item.array.length > minLen ? minLen : item.array.length)}%`}"
                        :key="index">
                        {{val ? val.num : ''}}
                    </li>
                </ul>
            </div>
            <div class='fixed-right'>
                <ul class="fixed-right-content">
                    <li class="table-cell" v-for="(item, index) in data" :key="index">
                        {{item.totalCount}}
                    </li>
                </ul>
            </div>
        </div>
        <fs-empty-tips v-if="!data.length" :iconType="type"
           :emptyMsg="getEmptyMsg()" />  
    </div>
</template>
<script>
import Ps from 'perfect-scrollbar';
import FsEmptyTips from 'app_component/common/empty-tips/';
import 'app_src/directives/loading/';

export default {
    props: {
        columns: {
            type: Object
        },
        data: {
            type: Array
        },
        type: {
            type: String
        },
    },
    data() {
        return {
            height: '',
            minLen: 14
        }
    },
    components: {
        FsEmptyTips
    },
    watch: {
        data() { // 监听数据发生变化时滚动到头部
            this.initScroll();
        }
    },
    methods: {
        initScroll() {
            let scrollArr = ['vertical'];
            if(this.columns.array.length > this.minLen) {
                scrollArr = ['headerHorizonal', 'vertical', 'bodyHorizonal'];
            }
            scrollArr.forEach(el=>{
                this.initPs(el);
            });
        },
        initPs(el) { // 初始化滚动条
            this.$nextTick(()=>{
                let container = this.$refs[el];
                if(container) {
                    Ps.destroy(container);
                    Ps.initialize(container, {
                        wheelSpeed: 0.5,
                        wheelPropagation: false,
                        useBothWheelAxes: true,
                        eventPassthrough : 'horizontal',
                        minScrollbarLength: 60,
                        maxScrollbarLength: 100
                    });
                    container.scrollTop = 0
                    container.scrollLeft = 0
                }
            })
        },
        onScroll(e) { // 头部身体一起滚动
            if(this.columns.array.length > this.minLen) { 
                let scrollLeft = e && e.target && e.target.scrollLeft || 0;
                let headerHorizonal = this.$refs.headerHorizonal;
                let bodyHorizonal = this.$refs.bodyHorizonal;
                headerHorizonal && (headerHorizonal.scrollLeft = scrollLeft);
                bodyHorizonal && (bodyHorizonal.scrollLeft = scrollLeft);
            }
        },
        scrollTo(dir) {
            let headerHorizonal = this.$refs.headerHorizonal;
            let bodyHorizonal = this.$refs.bodyHorizonal;
            let scrollLeft = headerHorizonal && headerHorizonal.scrollLeft;
            if(dir == 'right') {
                scrollLeft += 200
            } else {
                scrollLeft -= 200
            }
            headerHorizonal && (headerHorizonal.scrollLeft = scrollLeft);
            bodyHorizonal && (bodyHorizonal.scrollLeft = scrollLeft);
        },
        getEmptyMsg() {
            let tips = '';
            switch (this.type) {
                case 'dept':
                    tips = '部门'
                    break;

                case 'group':
                    tips = '团队'
                    break;
            
                default:
                    tips = '提交人'
                    break;
            }
           
            return `请先选择${tips}`
        }
    },
    mounted () {
        this.$eventbus.$on('changeHeight', ()=>{ // 计算当前屏幕宽度
            this.height = this.$store.state.screenHeight - 200;
            this.initScroll();
        })
        this.$eventbus.$emit('changeHeight');
    },
    destroyed () {
        this.$eventbus.$off('changeHeight');
    }
}
</script>
<style lang="less">
@import '../../assets/css/var.less';

.table {
    width: 100%;
    border-top: 1px solid @border-color;
    font-size: 0;
    position: relative;
    min-height: 250px;
    .ps.ps--active-x > .ps__scrollbar-x-rail, .ps.ps--active-y > .ps__scrollbar-y-rail {
        background-color: transparent!important;
    }
    .ps > .ps__scrollbar-x-rail > .ps__scrollbar-x {
        border-radius: 0!important;
        background-color: @gray-color-normal!important;
        height: 7px!important;
    }
    .table-header-content, .table-body-content {
        width: 76%;
        display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        position: relative;
    }
    .table-header-content {
        .ps__scrollbar-x-rail {
            top: 0!important;
            height: 30px!important;
            .ps__scrollbar-x {
                top: 0!important;
            }
        }
    }
    .table-body-content {
       .ps__scrollbar-x-rail, .ps__scrollbar-y-rail {
            display: none!important;
        }
    }
    .table-cell {
        display: inline-block;
        font-size: 12px;
        vertical-align: top;
        height: 30px;
        line-height: 30px;
        border-bottom: 1px solid @border-color;
        border-right: 1px solid @border-color;
        text-align: center;
        background-color: @white-color;
        color: @gray-color-dark;
        overflow: hidden;
        &.nodata {
            background-color: @white-color-light;
        }
    }
    .fixed-left {
        width: 18%;
        display: inline-block;
        vertical-align: top;
        border-left: 1px solid @border-color;
        position: relative;
        .fixed-left-content {
            width: 100%;
            .table-cell {
                width: 100%;
                text-align: left;
                padding: 0 15px;
            }
        }
    }
    .fixed-right {
        width: 6%;
        display: inline-block;
        vertical-align: top;
        position: relative;
        .fixed-right-content {
            width: 100%;
            .table-cell {
                width: 100%;
            }
        }
    }
    .table-header {
        background-color: @white-color-dark;
        border-right: 1px solid @border-color;
        .table-cell {
            background-color: @white-color-dark;
            color: @gray-color-light;
            border: none;
            height: 40px;
            line-height: 40px;
        }
        .icon {
            position: absolute;
            height: 40px;
            line-height: 40px;
            top: 0;
            font-size: 14px;
            &.icon-fullarrow-left {
                right: 0;
            }
            &.icon-fullarrow-right {
                left: 0;
            }
        }
    }
    .table-body {
        overflow: hidden;
        position: relative;
    }
}
</style>

