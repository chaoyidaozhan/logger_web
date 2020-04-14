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
                        ref="tableWidth"
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
        <div class="table-body" v-if="!!data.length" ref="vertical" :style="{'max-height': `${height}px`}">
            <div class="fixed-left">
                <ul class="fixed-left-content">
                    <li class="table-cell ellipsis" 
                        v-for="(item, index) in data" 
                        @click="handleModal(item)"
                        :key="index">
                        {{item[`${type == 'member' ? 'user' : type}Name`]}}
                    </li>
                </ul>
            </div>
            <div class="table-body-content" @scroll="onScroll" ref="bodyHorizonal">
                <ul class="table-content" 
                    v-for="(item, index) in data" 
                    @click="handleModal(item)"
                    :key="index">
                    <li class="table-cell" 
                        :class="{nodata: !val}"
                        v-for="(val, index) in item.array" 
                        :style="{'width': `${100/(item.array.length > minLen ? minLen : item.array.length)}%`}"
                        :title="val ? val.num : ''"
                        :key="index">
                        {{val ? val.num : ''}}
                    </li>
                </ul>
            </div>
            <div class='fixed-right'>
                <ul class="fixed-right-content">
                    <li class="table-cell"
                        @click="handleModal(item)"
                        v-for="(item, index) in data" :key="index">
                        {{item.totalCount ? `${item.totalCount}${$t('noun.article')}` : `0${$t('noun.article')}`}}
                    </li>
                </ul>
            </div>
        </div>
        <div class="table-footer" v-if="totalMap && data.length > 1">
            <div class="fixed-left">
                <ul class="fixed-left-content">
                    <li class="table-cell ellipsis">
                        {{$t('noun.statistics')}}
                    </li>
                </ul>
            </div>
            <div class="table-header-content" @scroll="onScroll" ref="footerHorizonal">
                <ul class="table-content">
                    <li class="table-cell" 
                        :class="{nodata: !totalMap[`${index+1}`]}"
                        v-for="(val, index) in columns.array" 
                        :style="{'width': `${100/(columns.array.length > minLen ? minLen : columns.array.length)}%`}"
                        :title="totalMap[`${index+1}`] ? `${totalMap[`${index+1}`]}${$t('noun.article')}` : ''"
                        :key="index">
                        {{totalMap[`${index+1}`] ? `${totalMap[`${index+1}`]}${$t('noun.article')}` : ''}}
                    </li>
                </ul>
            </div>
            <div class="fixed-right table-cell"
                :class="{nodata: !totalMap.total}"
                :title="totalMap.total ? `${totalMap.total}${$t('noun.article')}` : ''"
                >
                {{totalMap.total ? `${totalMap.total}${$t('noun.article')}` : ''}}
            </div>
        </div>
        <YYEmpty v-if="!data.length" :iconType="emptyData ? '' : type"
           :text="emptyData ? $t('status.noRelevantData') : getEmptyMsg()" />  
    </div>
</template>
<script>
import PerfectScrollbar from 'perfect-scrollbar';
let Ps = null;

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
        totalMap: {
            type: Object
        },
        emptyData: {
            type: Boolean,
            default: false
        },
        refuse: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            height: '',
            minLen: 14
        }
    },
    watch: {
        data() { // 监听数据发生变化时滚动到头部
            this.initScroll();
        }
    },
    methods: {
        handleModal(data) {
            if(!this.refuse) {
                this.$eventbus.$emit('handleModal', data);
            }
        },
        initScroll() {
            let scrollArr = ['headerHorizonal', 'footerHorizonal', 'vertical', 'bodyHorizonal'];
            scrollArr.forEach(el=>{
                this.initPs(el);
            });
        },
        initPs(el) { // 初始化滚动条
            this.$nextTick(()=>{
                let container = this.$refs[el];
                if(container) {
                    Ps && Ps.destroy(container);
                    Ps = new PerfectScrollbar(container, {
                        wheelSpeed: 0.5,
                        wheelPropagation: false,
                        useBothWheelAxes: true,
                        eventPassthrough : 'horizontal',
                        minScrollbarLength: 60,
                        maxScrollbarLength: 100
                    })
                    // Ps.initialize(container, {
                    //     wheelSpeed: 0.5,
                    //     wheelPropagation: false,
                    //     useBothWheelAxes: true,
                    //     eventPassthrough : 'horizontal',
                    //     minScrollbarLength: 60,
                    //     maxScrollbarLength: 100
                    // });
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
                let footerHorizonal = this.$refs.footerHorizonal;
                headerHorizonal && (headerHorizonal.scrollLeft = scrollLeft);
                bodyHorizonal && (bodyHorizonal.scrollLeft = scrollLeft);
                footerHorizonal && (footerHorizonal.scrollLeft = scrollLeft);
            }
        },
        scrollTo(dir) {
            let headerHorizonal = this.$refs.headerHorizonal;
            let bodyHorizonal = this.$refs.bodyHorizonal;
            let scrollLeft = headerHorizonal && headerHorizonal.scrollLeft;

            let tableWidth = this.$refs.tableWidth && this.$refs.tableWidth[0] && this.$refs.tableWidth[0].offsetWidth || 200;
            if(dir == 'right') {
                scrollLeft += tableWidth
            } else {
                scrollLeft -= tableWidth
            }
            headerHorizonal && (headerHorizonal.scrollLeft = scrollLeft);
            bodyHorizonal && (bodyHorizonal.scrollLeft = scrollLeft);
        },
        getEmptyMsg() {
            let tips = '';
            switch (this.type) {
                case 'dept':
                    tips = this.$t('noun.department')
                    break;

                case 'group':
                    tips = this.$t('noun.internalGroup')
                    break;
            
                default:
                    tips = this.$t('noun.personnel')
                    break;
            }
           
            return `${this.$t('operate.please')}${this.$t('operate.select')}${tips}`
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
@import '~app_assets/css/var.less';

.table {
    width: 100%;
    font-size: 0;
    position: relative;
    .yy-empty {
        margin-top: 10%;
    }
    .ps.ps--active-x > .ps__scrollbar-x-rail, .ps.ps--active-y > .ps__scrollbar-y-rail {
        background-color: transparent!important;
    }
    .ps > .ps__scrollbar-x-rail > .ps__scrollbar-x {
        border-radius: 0!important;
        background-color: @border-color-base!important;
        height: 4px!important;
    }
    .table-header-content, .table-body-content {
        width: 72%;
        display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        position: relative;
        border-left: 1px solid #F0F0F0;
    }
    .table-header-content {
        .ps__scrollbar-x-rail {
            top: 0!important;
            height: 30px!important;
            .ps__scrollbar-x {
                top: 0!important;
            }
        }
        .table-content .table-cell {
            border-right: 1px solid #F0F0F0;
        }
    }
    .table-body-content,.table-footer {
       .ps__scrollbar-x-rail, .ps__scrollbar-y-rail {
            display: none!important;
        }
    }
    .table-cell {
        display: inline-block;
        font-size: 12px;
        vertical-align: top;
        height: 36px;
        line-height: 36px;
        border-bottom: 1px solid #F0F0F0;
        border-right: 1px solid #F0F0F0;
        text-align: center;
        background-color: @white-color;
        color: @gray-color-dark;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        &.nodata {
            background-color: #F5F6F8;
        }
    }
    .fixed-left {
        width: 18%;
        display: inline-block;
        vertical-align: top;
        position: relative;
        .fixed-left-content {
            width: 100%;
            .table-cell {
                width: 100%;
                text-align: left;
                padding: 0 15px;
            }
            .table-cell {
                border-right: none;
            }
        }
    }
    .fixed-right {
        width: 10%;
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
        border-top: 1px solid #AAA;
        background-color: @white-color-dark;
        .table-cell {
            background-color: #F7F9FD;
            color: #333;
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

