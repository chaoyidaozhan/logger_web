<template>
    <div class="page-logger-content" >
        <!-- <div class="leftMenu" v-if="isShowMenu">
            <div class="left-header">
                {{loggerItemData.userName}}的工作汇报
                <div class="left-close">
                    <i class="icon-add"></i>
                </div>
            </div>
            <div class="left-line"></div>
            <div class="left-content">
                <div class="left-item" v-for="(item, index) in menus" :key="index">{{item.title}}</div>
            </div>
        </div> -->
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
                    :menus="item.title"
                    :scrollAll="scrollAll"
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
        <!-- <div class="righttMenu"></div> -->
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
        // 
        showDatePicker: {
            type: Boolean,
            default: false
        },
        initCreateDate: {
            type: Function,
            default: function() {}  
        }
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
            menus:[],
            // tool:null,
            scrollAll: 0 //当前滚动的长度
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
            };
            let currentDate = new Date().getTime();
            let beginDate = FormatTime(new Date(currentDate - 100*24*60*60*1000), 'YYYY-MM-DD');
            let endDate = FormatTime(new Date(), 'YYYY-MM-DD');
            if(this.showDatePicker && !this.params.beginDate && !this.params.endDate) {
                data.beginDate = beginDate;
                data.endDate = endDate;
                this.initCreateDate([beginDate, endDate]);
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
                this.scrollAll = scrollTop
            }
        },
        updateList(res) { // load成功之后更新数据
            if(res.groupId && res.groupId !== this.getParams().groupId) return
            if(res && res.code === 0) {
                this.hasMore = true
                if(this.pageNo == 1) {
                    this.list = res.data || []
                } else {
                    this.list = this.list.concat(res.data || [])
                }
                this.list.forEach((item) => {
                    let items = JSON.parse(item.content)
                    item.title = items;
                })
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
            const id = (new Date).valueOf()
            this.loading = true
            this.$eventbus.$emit('setBtnLoading', this.loading)
            const groupId = this.getParams().groupId || null
            this.$ajax({
                url: this.url,
                data: this.getParams(),
                success: (res)=>{
                    res.groupId = groupId
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
        },
        // showMenu() {
        //     this.$eventbus.$emit('showMenu', this.tool)
        //     let leftMenu = document.querySelector('.leftMenu')  //visibility
        //     leftMenu.style.visibility = 'visible'
        // },
        // closeMenu() {
        //     this.$eventbus.$emit('closeMenu', this.tool)
        //     let leftMenu = document.querySelector('.leftMenu')  //visibility
        //     leftMenu.style.visibility = 'hidden'
        // }
    },
    mounted () {
        this.queryMemberId = this.$store.state.userInfo.member_id
        this.initList()
    },
    // created() {
    //     this.$eventbus.$on('transforTool',(tool)=>{
    //         this.tool = tool
    //     })
    // },
    // destroyed() {
    //     this.$eventbus.$off('transforTool')
    // }
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
.page-logger-content{
    margin-top: 10px;
    // .leftMenu{
    //     position: absolute;
    //     // background: #fff;
    //     visibility: hidden;
    //     width: 188px;
    //     height: 100%;
    //     padding: 6px 16px 8px 16px;
    //     .left-header{
    //         font-size:12px;
    //         font-family:PingFangSC-Regular,PingFang SC;
    //         font-weight:400;
    //         color:rgba(153,153,153,1);
    //         height: 17px;
    //         line-height: 17px;
    //         .left-close{
    //             display: inline-block;
    //             float: right;
    //         }
    //     }
    //     .left-line{
    //         margin-top: 8px;
    //         width:156px;
    //         height:1px;
    //         background: #D9D9D9;
    //     }
    //     .left-content{
    //         width:156px;
    //         height:144px;
    //         margin-top: 8px;
    //         font-size:12px;
    //         font-family:PingFangSC-Regular,PingFang SC;
    //         font-weight:400;
    //         color:rgba(51,51,51,1);
    //         .left-item{
    //             cursor: pointer;
    //             height: 36px;
    //             line-height: 36px;
    //         }
    //     }
    // }
    .page-logger-list {
        height: 100vh;
        overflow: auto;
        .loading {
            height: 60px;
            line-height: 50px;
            text-align: center;
            font-size: 14px;
            // background-color: @white-color;
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
    // .rightMenu{

    // }
}

</style>
