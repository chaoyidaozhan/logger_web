<template>
    <div class="page-logger-list" @scroll.stop="onScroll">
        <transition-group name="fade">
            <fs-logger-list-item 
                v-for="(item, index) in list"
                @handleDelete="handleDelete"
                @handleViewLowerLevel="handleViewLowerLevel"
                @handleOperateModal="handleOperateModal"
                :index="index" 
                :isDraft="isDraft"
                :isLowerLevel="isLowerLevel"
                :loggerItemData="item"
                :key="item.id || index" />
        </transition-group>
        <YYLoadingH  v-if='loading' :text="$t('status.loading')"></YYLoadingH>
        <div class="loading">
            <div class="loading-content" v-if="!hasMore && !loading && list.length">{{$t('status.loadedAllData')}}</div>
        </div>
        <YYEmpty vertical="top" v-if="!list.length && !loading"/>
         <!--操作记录弹层-->
        <Modal
            v-model="operateModal"
            class="operate-modal"
            :title="$t('noun.operationRecord')">   
            <div class="operate-row" v-for="item in operateModalData" :key="item.id">
                <fs-avatar class="operate-avatar" 
                    size="31px" 
                    :avatar="item.avatar" 
                    :fontSize="item.userName ? '12px' : '18px'" 
                    :name="item.userName"></fs-avatar>
                <div class="operate-content">
                    <div class="clearfix">
                        <span>{{item.userName}}</span>
                        <span class="pull-right">{{item.createTime | filterDiaryUserTime}}</span>
                    </div>
                    <div>
                        {{item.reason}}
                    </div>
                </div>
            </div>
            <p slot="footer"></p>
        </Modal>
    </div>
</template>
<script>
import FsLoggerListItem from './item'
import FormatTime from 'app_src/filters/format-time'
import FsAvatar from 'app_component/common/avatar'

/**
    range 
    0  所有日志
    4  @我的
    -1 我的日志
    3  内部群日志
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
            default: '/diaryQuery/getAllDiary'
        },
        isCollect: {
            type: Boolean,
            default: false
        },
        isLowerLevel: {
            type: Boolean,
            default: false
        },
        isDraft: {
            type: Boolean,
            default: false
        },
        isUnread: {
            type: Boolean,
            default: false
        },
        withPublic: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            list: [],
            pageNo: 1, 
            pageSize: 20, 
            loading: false,
            loaderror: false,
            hasMore: true,
            queryMemberId: null,
            operateModal: false,
            operateModalData: null,
        }
    },
    components: {
        FsLoggerListItem,
        FsAvatar
    },
    watch: {
        pageNo: 'loadData',
        params: 'initList',
        withPublic: 'initList'
    },
    filters: {
        filterDiaryUserTime(val) { // 格式化日志日期
            return FormatTime(new Date(val), 'YYYY-MM-DD HH:mm')
        }
    },
    methods: {
        handleOperateModal(param) {
            this.operateModal = true
            this.operateModalData = param
        },
        getParams() { // 获取参数
            let data = {
                pageNo: this.pageNo,
                pageSize: this.pageSize,
                range: this.range,
                withPublic: this.withPublic
            }
            if(this.isUnread) {
                data.withPublic = this.withPublic
            }
            if(!this.isCollect) {
                data.dataStatus = this.dataStatus
            }
            if(this.isLowerLevel) {
                data.memberId = this.queryMemberId
            }
            return Object.assign(data, this.params)
        },
        onScroll(e) { // 分页
            if(!this.loading && this.hasMore) {
                let $target = e && e.target
                let scrollHeight = $target.scrollHeight
                let scrollTop = $target.scrollTop
                let offsetHeight = $target.offsetHeight
                
                if ((scrollHeight - scrollTop) - offsetHeight < 20) {
                    this.pageNo++
                }
            }
        },
        updateList(res) { // load成功之后更新数据
            if(res && res.code === 0) {
                this.hasMore = true
                if(this.pageNo == 1) {
                    this.list = res.data || []
                } else {
                    this.list = this.list.concat(res.data || [])
                }
                if (res.data && res.data.length < this.pageSize) {
                    this.hasMore = false
                }
            } else {
                this.list = []
                this.$YYMessage.warning((res && res.msg) || this.$t('status.networkError'))
            }
        },
        handleDelete(id) { // 删除
            if(id) {
                let eq
                this.list.forEach((item, index)=>{
                    if(item.id == id || item.draftId === id) {
                        eq = index
                    }
                })
                this.list.splice(eq, 1)
            }
        },
        handleViewLowerLevel(id) { // 查看下级日志
            this.queryMemberId = id
            this.initList()
        },
        loadData() { // 请求接口
            this.loading = true
            this.$eventbus.$emit('setBtnLoading', this.loading)
            this.$ajax({
                url: this.url,
                data: this.getParams(),
                success: (res)=>{
                    this.loading = false
                    this.$eventbus.$emit('setBtnLoading', this.loading)
                    this.updateList(res)
                },
                error: (res)=>{
                    this.loaderror = true
                    this.loading = false
                    this.$eventbus.$emit('setBtnLoading', this.loading)
                }
            })
        },
        initList() { // 初始化列表
            this.list = []
            this.pageNo = 1
            this.loading = false
            this.hasMore = true
            this.loadData()
        }
    },
    mounted () {
        this.queryMemberId = this.$store.state.userInfo.member_id
        this.initList()
    }
}
</script>
<style lang="less" scoped>
@import '../../../assets/css/var.less';
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
