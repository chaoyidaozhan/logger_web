<template>
    <div class="page-logger-query" @scroll.stop="onScroll">
        <transition-group name="fade">
            <fs-logger-list-item 
                v-for="item in list" 
                :loggerItemData="item"
                :key="item.id" />
        </transition-group>
        <div class="loading">
            <div v-if='loading'>
                <Spin>
                    <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                    <span>正在加载中...</span>
                </Spin>
            </div>
            <div v-if="!hasMore && !loading">已加载全部数据</div>
        </div>
    </div>
</template>
<script>
import LoggerList from '../../mixins/logger-list';
import FsLoggerListItem from '../common/logger-list-item/';
/**
    range 
    0  所有日志
    4  @我的
    -1 我的日志
    3  团队日志
    1  下属日志
**/
export default {
    data() {
        return {
            
        }
    },
    mixins: [LoggerList],
    components: {
        FsLoggerListItem
    },
    watch: {
        '$route': function (to, from) {
            this.initList();
        }
    },
    methods: {
        loadData() {
            this.loading = true;
            this.$ajax({
                url: '/logger/diaryQuery/getAllDiary',
                data: this.getParams(this.params),
                success: (res)=>{
                    this.loading = false;
                    this.updateList(res);
                }
            })
        },
    },
}
</script>
<style lang="less" scoped>
@import '../../assets/css/var.less';
.demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
}
.page-logger-query {
    width: 100%;
    height: 100%;
    overflow: auto;
    .loading {
        height: 60px;
        line-height: 50px;
        text-align: center;
        font-size: 14px;
        background-color: @white-color-lighter;
        color: @gray-color-light;
        * {
            vertical-align: middle;
            color: @gray-color-light;
        }
    }
}
</style>
