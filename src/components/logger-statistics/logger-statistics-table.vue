<template>
    <div class="table">
        <div class="table-header">
            <div class="table-row clearfix">
                <div class="table-title table-cell ellipsis">{{columns.title}}</div>
                <ul class="table-content">
                    <li class="table-cell" 
                        v-for="(val, index) in columns.array" 
                        :style="{'width': `${100/columns.array.length}%`}"
                        :key="index">
                        {{val}}月
                    </li>
                </ul>
                <div class="table-caption table-cell">{{columns.caption}}</div>
            </div>
        </div>    
        <div v-show="!!data.length" class="table-body" ref="tableScroll" :style="{'height': `${height}px`}">
            <div class="table-row clearfix"  v-for="item in data" :key="item.deptId">
                <div class="table-title table-cell ellipsis">
                    <span v-if="type!='member'">{{item.deptName}}</span>
                </div>
                <ul class="table-content">
                    <li class="table-cell" 
                        :class="{nodata: !val}"
                        v-for="(val, index) in item.array" 
                        :style="{'width': `${100/item.array.length}%`}"
                        :key="index">
                        {{val ? val.num : ''}}
                    </li>
                </ul>
                <div class="table-caption table-cell">{{item.totalCount}}</div>
            </div>
        </div>
        <fs-empty-tips v-if="!data.length" :iconType="type"
           :emptyMsg="getEmptyMsg()" />  
    </div>
</template>
<script>
import Ps from 'perfect-scrollbar';
import FsEmptyTips from 'app_component/common/empty-tips/';
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
        initScroll() { // 初始化滚动条
            this.$nextTick(()=>{
                let container = this.$refs.tableScroll;
                if(container) {
                    Ps.destroy(container);
                    Ps.initialize(container, {
                        wheelSpeed: 0.5,
                        wheelPropagation: false,
                        useBothWheelAxes: true,
                        eventPassthrough : 'horizontal',
                        minScrollbarLength: 60,
                        maxScrollbarLength: 300
                    });
                    container.scrollTop = 0
                }
            })
        },
        getEmptyMsg() {
            let tips = '';
            switch (this.type) {
                case 'depart':
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
.ps.ps--active-x > .ps__scrollbar-x-rail, .ps.ps--active-y > .ps__scrollbar-y-rail {
    background-color: transparent!important;
}
.table {
    width: 100%;
    border-top: 1px solid @border-color;
    .table-header {
        .table-cell {
            border-right: 0;
            background-color: @white-color-dark;
        }
    }
    .table-row {
        line-height: 20px;
        font-size: 0;
    }
    .table-cell {
        display: inline-block;
        font-size: 12px;
        vertical-align: middle;
        padding: 5px 10px;
        height: 30px;
        border-bottom: 1px solid @border-color;
        border-right: 1px solid @border-color;
        text-align: center;
        background-color: @white-color;
        &.nodata {
            background-color: @white-color-light;
        }
    }
    .table-title {
        width: 18%;
        text-align: left;
        border-left: 1px solid @border-color;
    }
    .table-content {
        width: 76%;
        display: inline-block;
    }
    .table-caption {
        width: 6%;
    }
    .table-body {
        overflow: auto;
        position: relative;
    }
}
</style>

