<template>
    <div v-if="showGlobalModal" id="globalModal" class="page-logger-list" @scroll.stop="onScroll">
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
        <div class="canvaldialog"> 
            <canvas id="draw" width="800" height="800"></canvas>
            <div class="tooldialog">
                <div class="fontAdd" @click='fontAdd()'>
                    <i class="icon-add" ></i>
                </div>
                <div class="fontReduce" @click="fontReduce()">
                    <i class="icon-add" ></i>
                </div>
                <div class="exit" @click="exit()">
                    <i class="icon-add" ></i>
                </div>
                <div class="drawing" @click="drawing()">
                    <i class="icon-add" v-if="isCanval"></i>
                    <i class="icon-delete" v-else></i>
                </div>
                <div class="back2top" @click="back2top()">
                    <i class="icon-add" ></i>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import FsLoggerListItem from './globalModalitem'
import FormatTime from 'app_src/filters/format-time'
import FsAvatar from 'app_component/common/avatar'
import GlobalModal from './globalModal'

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
            showGlobalModal: false,
            loggerListItemModalFontSize:14,
            captionModalFontSize:13,
            loggerListRangeModalFontSize:12,
            isCanval: false,
            isFirstCanval: true
        }
    },
    components: {
        FsLoggerListItem,
        FsAvatar,
        GlobalModal
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
        //退出全屏方法
        exitFullScreen() {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExiFullscreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();

            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
            this.showGlobalModal = false
        },
         //打开全屏方法
        openFullscreen(element) {
            if(element){
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                } else if (element.webkitRequestFullscreen) {
                    element.webkitRequestFullScreen();
                }
            }
        },
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
        // initDraw(){
        //     const canvas = document.querySelector('#draw');
        //     const ctx = canvas.getContext('2d');
        //     canvas.width = window.innerWidth;
        //     canvas.height = window.innerHeight;
        //     ctx.strokeStyle = '#FF0000'; //ctx is the canvas
        //     ctx.lineJoin = 'round';
        //     ctx.lineCap = 'round';
        //     ctx.lineWidth = 10;
        //     let isDrawing = false;
        //     let lastX = 0;
        //     let lastY = 0;
        //     let hue = 0;
        //     let direction = true;
        //     function draw(e) {
        //         if (!isDrawing) return; // stop the fn from running when they are not moused down
        //         console.log(e);
        //         ctx.beginPath();
        //         // start from
        //         ctx.moveTo(lastX, lastY);
        //         // go to
        //         ctx.lineTo(e.offsetX, e.offsetY);
        //         ctx.stroke();
        //         [lastX, lastY] = [e.offsetX, e.offsetY];

        //         hue++;
        //         if (hue >= 360) {
        //             hue = 0;
        //         }
        //     }
        //     canvas.addEventListener('mousedown', (e) => {
        //         isDrawing = true;
        //         [lastX, lastY] = [e.offsetX, e.offsetY];
        //     });
        //     canvas.addEventListener('mousemove', draw);
        //     canvas.addEventListener('mouseup', () => isDrawing = false);
        //     canvas.addEventListener('mouseout', () => isDrawing = false);
        //     this.isCanval = true
        // },
        drawing(){
            const canvas = document.querySelector('#draw');
            const ctx = canvas.getContext('2d');
            let isDrawing = false;
            let lastX = 0;
            let lastY = 0;
            let hue = 0;
            let direction = true;
            if(this.isFirstCanval){
                this.mousedownCanval = function mousedownCanval(e){
                    isDrawing = true;
                    [lastX, lastY] = [e.offsetX, e.offsetY];
                }
                this.draw = function draw(e) {
                    if (!isDrawing) return; // stop the fn from running when they are not moused down
                    console.log(e);
                    ctx.beginPath();
                    // start from
                    ctx.moveTo(lastX, lastY);
                    // go to
                    ctx.lineTo(e.offsetX, e.offsetY);
                    ctx.stroke();
                    [lastX, lastY] = [e.offsetX, e.offsetY];
    
                    hue++;
                    if (hue >= 360) {
                        hue = 0;
                    }
                }
    
                this.mouseupCanval = function mouseupCanval(e){
                    isDrawing = false
                }
                this.isFirstCanval = false
            }
            
            if(!this.isCanval){
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                ctx.strokeStyle = '#FF0000'; //ctx is the canvas
                ctx.lineJoin = 'round';
                ctx.lineCap = 'round';
                ctx.lineWidth = 10;


                canvas.addEventListener('mousedown', this.mousedownCanval, false);
                canvas.addEventListener('mousemove', this.draw, false);
                canvas.addEventListener('mouseup', this.mouseupCanval, false);
                canvas.addEventListener('mouseout', this.mouseupCanval, false);
                this.isCanval = true
            }else{
                canvas.removeEventListener('mousedown', this.mousedownCanval, false);
                canvas.removeEventListener('mousemove', this.draw, false);
                canvas.removeEventListener('mouseup', this.mouseupCanval, false);
                canvas.removeEventListener('mouseout', this.mouseupCanval, false);
                this.isCanval = false
            }
            
        },
        fontAdd(){
            this.loggerListItemModalFontSize ++
            this.captionModalFontSize ++ 
            this.loggerListRangeModalFontSize ++
            let loggerListItemModals = document.querySelectorAll('.logger-list-item-modal')
            let captionModals = document.querySelectorAll('.caption-modal')
            let loggerListRangeModals = document.querySelectorAll('.logger-list-range-modal')
            loggerListItemModals.forEach((loggerListItemModal) => {
                loggerListItemModal.style.fontSize= this.loggerListItemModalFontSize + 'px'
            })
            captionModals.forEach((captionModal) => {
                captionModal.style.fontSize= this.captionModalFontSize + 'px'
            })
            loggerListRangeModals.forEach((loggerListRangeModal) => {
                loggerListRangeModal.style.fontSize= this.loggerListRangeModalFontSize + 'px'
            })
        },
        fontReduce(){
            this.loggerListItemModalFontSize --
            this.captionModalFontSize --
            this.loggerListRangeModalFontSize --
            let loggerListItemModals = document.querySelectorAll('.logger-list-item-modal')
            let captionModals = document.querySelectorAll('.caption-modal')
            let loggerListRangeModals = document.querySelectorAll('.logger-list-range-modal')
            loggerListItemModals.forEach((loggerListItemModal) => {
                loggerListItemModal.style.fontSize= this.loggerListItemModalFontSize + 'px'
            })
            captionModals.forEach((captionModal) => {
                captionModal.style.fontSize= this.captionModalFontSize + 'px'
            })
            loggerListRangeModals.forEach((loggerListRangeModal) => {
                loggerListRangeModal.style.fontSize= this.loggerListRangeModalFontSize + 'px'
            })
        },
        exit(){
            this.loggerListItemModalFontSize=14
            this.captionModalFontSize=13
            this.loggerListRangeModalFontSize=12
            this.exitFullScreen()
        },
        back2top(){
            this.$el.scrollTop = 0
        }
    },
    updated () {
        this.openFullscreen(document.getElementById("globalModal"))
    },
    mounted () {
        this.queryMemberId = this.$store.state.userInfo.member_id
        this.initList()
    },
    created() {
        let _this = this
        this.$eventbus.$on('openglobal', ()=>{
            _this.showGlobalModal = true
        })
        document.addEventListener("fullscreenchange", function () {
            if (document.fullscreenElement != null) {
                console.info("Went full screen");
            } else {
                this.loggerListItemModalFontSize=14
                this.captionModalFontSize=13
                this.loggerListRangeModalFontSize=12
                _this.showGlobalModal = false
                console.info("Exited full screen");
            }
        });
    },
    destroyed(){
        this.$eventbus.$off('openglobal')
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
    background: #FFF;
    height: auto;
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
    .canvaldialog{
        position: fixed;
        top:0;
        bottom:0;
        left: 0;
        right: 0;
        .tooldialog{
            position: fixed;
            top: 0;
            bottom: 0;
            width: 120px;
            right: 0;
            color: #FFF;
            padding: 36px;
            .fontAdd{
                background: #000;
                opacity:0.36;
                width: 48px;
                height: 48px;
                color: #FFF;
                line-height: 48px;
                text-align: center;
                cursor: pointer;
            }
            .fontReduce{
                background: #000;
                opacity:0.36;
                width: 48px;
                height: 48px;
                color: #FFF;
                line-height: 48px;
                text-align: center;
                cursor: pointer;
            }
            .exit{
                background: #000;
                opacity:0.36;
                width: 48px;
                height: 48px;
                color: #FFF;
                line-height: 48px;
                text-align: center;
                cursor: pointer;
            }
            .drawing{
                background: #000;
                opacity:0.36;
                width: 48px;
                height: 48px;
                color: #FFF;
                line-height: 48px;
                text-align: center;
                cursor: pointer;
            }
            .back2top{
                position: absolute;
                bottom: 36px;
                background: #000;
                opacity:0.36;
                width: 48px;
                height: 48px;
                color: #FFF;
                line-height: 48px;
                text-align: center;
                cursor: pointer;
            }
        }
    }
}

</style>

