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
        <div class="table-body" ref="tableScroll" :style="{'height': `${height}px`}">
            <div class="table-row clearfix"  v-for="item in data" :key="item.deptId">
                <div class="table-title table-cell ellipsis">
                    <span v-if="type=='depart'">{{item.deptName}}</span>
                    <span v-if="type=='group'">{{item.groupName}}</span>
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
    </div>
</template>
<script>
import Ps from 'perfect-scrollbar';

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
            height: ''
        }
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
            })
        },
    },
    mounted () {
        this.$eventbus.$off('changeHeight').$on('changeHeight', ()=>{ // 计算当前屏幕宽度
            this.height = this.$store.state.screenHeight - 200;
            this.initScroll();
        })
        this.$eventbus.$emit('changeHeight');
    }
}
</script>
<style lang="less" scoped>
.table {
    width: 100%;
    border-top: 1px solid #eeeeee;
    border-left: 1px solid #eeeeee;
    .table-header {
        .table-cell {
            border-right: 0;
            background-color: #eee;
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
        border-bottom: 1px solid #eeeeee;
        border-right: 1px solid #eeeeee;
        text-align: center;
        background-color: #fff;
        &.nodata {
            background-color: #ccc;
        }
    }
    .table-title {
        width: 18%;
        text-align: left;
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

