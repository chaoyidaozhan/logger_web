<template>
    <div class="page-logger-list" @scroll.stop="onScroll">
        <transition-group name="fade">
            <fs-logger-list-item 
                v-for="(item, index) in list"
                :index="index" 
                :isDraft="isDraft"
                @handleDelete="handleDelete"
                :loggerItemData="item"
                :key="item.id" />
        </transition-group>
        <div class="loading">
            <div class="loading-content" v-if='loading'>
                <Spin>
                    <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                    <span>正在加载中...</span>
                </Spin>
            </div>
            <div class="loading-content" v-if="!hasMore && !loading && list.length">已加载全部数据</div>
        </div>
        <fs-empty-tips v-if="!list.length && !loading"/>
    </div>
</template>
<script>
import FsLoggerListItem from './logger-list-node';
import FsEmptyTips from 'app_component/common/empty-tips/'
/**
    range 
    0  所有日志
    4  @我的
    -1 我的日志
    3  团队日志
    1  下属日志
**/
export default {
    props: {
        params: { // 暴露的对象字段
            type: Object,
        },
        dataStatus: { // 日志查询标记
            type: Number,
            default: 1
        },
        range: {
            type: String,
            default: '0'
        },
        url: {
            type: String,
            default: '/logger/diaryQuery/getAllDiary'
        },
        isCollect: {
            type: Boolean,
            default: false
        },
        isDraft: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            list: [],
            pageNum: 1, 
            pageSize: 20, 
            loading: false,
            loaderror: false,
            hasMore: true,
        }
    },
    components: {
        FsLoggerListItem,
        FsEmptyTips
    },
    watch: {
        pageNum: 'loadData',
        params: 'initList' 
    },
    methods: {
        getParams() { // 获取参数
            let data = {
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                range: this.range,
            }
            if(!this.isCollect) {
                data.dataStatus = this.dataStatus
            }
            return Object.assign(data, this.params)
        },
        onScroll(e) { // 分页
            if(!this.loading && this.hasMore) {
                let $target = e && e.target;
                let scrollHeight = $target.scrollHeight;
                let scrollTop = $target.scrollTop;
                let offsetHeight = $target.offsetHeight;
                if (offsetHeight == (scrollHeight - scrollTop)) {
                    this.pageNum++
                }
            }
        },
        updateList(res) { // load成功之后更新数据
            if(res && res.code === 0) {
                this.hasMore = true;
                if(this.pageNum == 1) {
                    this.list = res.data || [];
                } else {
                    this.list = this.list.concat(res.data || []);
                }
                if (res.data && res.data.length < this.pageSize) {
                    this.hasMore = false;
                }
            } else {
                this.list = [];
                this.$Message.warning((res && res.msg) || '网络错误');
            }
        },
        handleDelete(id) {
            if(id) {
                let eq;
                this.list.forEach((item, index)=>{
                    if(item.id == id) {
                        eq = index;
                    }
                });
                this.list.splice(eq, 1);
            }
        },
        loadData() { // 请求接口
            this.loading = true;
            this.$eventbus.$emit('setBtnLoading', this.loading);
            this.$ajax({
                url: this.url,
                data: this.getParams(),
                success: (res)=>{
                    this.loading = false;
                    this.$eventbus.$emit('setBtnLoading', this.loading);
                    this.updateList(res);
                },
                error: (res)=>{
                    this.loaderror = true;
                    this.loading = false;
                    this.$eventbus.$emit('setBtnLoading', this.loading);
                }
            });
        },
        initList() { // 初始化列表
            this.list = [];
            this.pageNum = 1;
            this.loading = false;
            this.hasMore = true;
            this.loadData();
        },
    },
    mounted () {
        this.initList();
    }
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
.page-logger-list {
    height: 100%;
    overflow: auto;
    .loading {
        height: 60px;
        line-height: 50px;
        text-align: center;
        font-size: 14px;
        background-color: @white-color;
        color: @gray-color-light;
        position: relative;
        overflow: hidden;
        * {
            vertical-align: middle;
            color: @gray-color-light;
        }
        .loading-content {
            position: absolute;
            top:0;
            width: 100%;
            height: 100%;
            left: 0;
        }
    }
}
</style>
