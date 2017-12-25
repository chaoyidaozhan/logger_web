<template>
    <div class="group-wrap" ref="groupWrap"  @scroll.stop="onScroll">
        <div class="group-item clearfix"
            :class="{active: (currentId == groupItem.groupId)}"
            v-for="groupItem in groupsData"
            :key="groupItem.groupId"
            @click="getDaily(groupItem)">
            <avatar class="pull-left" :avatar="groupItem.logo"></avatar>
            <div class="group-row-right">
                <p class="ellipsis group-name">{{groupItem.groupName}} ({{groupItem.groupMemberCount}})人</p>
                <p class="ellipsis">{{groupItem.diaryNum}}篇日志</p>
                <p class="ellipsis">{{groupItem.lastUpdateTime}}更新</p>
            </div>
        </div>
        <loading :loading="loading"
                 :loadError="loaderror"
                 :hasMore="hasMore"
                 @handleReload="handleReload"></loading>
    </div>
</template>
<script>
import Avatar from '../avatar';
import FormatTime  from 'app_src/filters/format-time';
import Ps from 'perfect-scrollbar';
import FsEmptyTips from 'app_component/common/empty-tips/'
import Loading from 'app_component/common/loading-scroll/'
export default {
    data() {
        return {
            pageSize: 15,
            pageNum: 1,
            groupsData: [],
            currentId: '',
            loading: false,
            loaderror: false,
            hasMore: true
        }
    },
    components: {
        Avatar,
        FsEmptyTips,
        Loading
    },
    watch: {
        pageNum: "loadData"
    },
    methods: {
        loadData() {
            this.loading = true;
            this.$ajax({
                url: '/logger/diaryQuery/getGeneralGroupDiary',
                type: 'get',
                data: {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                },
                success: (res)=>{
                    this.updateList(res);
                },
                error: (res)=>{
                    this.loading = false;
                    this.loaderror = true;
                }
            });
        },
        updateList(res) {
            if(res && res.code === 0) {
                this.loading = false;
                res.data && res.data.forEach((item)=>{
                    item.lastUpdateTime = FormatTime(new Date(item.lastUpdateTime), "YYYY-MM-DD");
                });
                if(this.pageNum === 1) {
                    this.groupsData = res.data || [];
                    this.currentId = this.groupsData[0] && this.groupsData[0].groupId;
                    this.$emit("getDaily", this.currentId);
                }else {
                    this.groupsData = this.groupsData.concat(res.data || []);
                }
                if (res.data && res.data.length < this.pageSize) {
                    this.hasMore = false;
                }
                this.initScroll();            
            }else {
                this.loading = false;
                this.loaderror = true;
            }
        },
        initScroll() {
            this.$nextTick(()=>{
                let container = this.$refs.groupWrap;
                Ps.destroy(container);
                Ps.initialize(container, {
                    wheelSpeed: 0.5,
                    wheelPropagation: false,
                    useBothWheelAxes: true,
                    eventPassthrough : 'horizontal',
                    minScrollbarLength: 60,
                    maxScrollbarLength: 300
                });
            })
        },
        onScroll(e) {
            if(!this.loading && this.hasMore) {
                let $target = e && e.target;
                let scrollHeight = $target.scrollHeight;
                let scrollTop = $target.scrollTop;
                let offsetHeight = $target.offsetHeight;
                if (offsetHeight == (scrollHeight - scrollTop)) {
                    this.pageNum++;
                }
            }
        },
        getDaily(params) {
            this.currentId = params.groupId;
            this.$emit("getDaily", this.currentId);
        },
        handleReload() {
            this.loaderror = false;            
            this.loading = true;
            this.loadData();
        }
    },
    created() {
        this.loadData();  
    }
}
</script>
<style lang="less" scoped>
    @import "../../../assets/css/var.less";
    .group-wrap {
        position: absolute;
        left: 0;
        top: 0;        
        width: 200px;
        height: 100%;        
        font-size: 12px;
        line-height: 1.5;
        background-color: @white-color;
        border-right: 1px solid @border-color;
        .group-item {
            padding: 10px;            
            cursor: pointer;
            &.active {
                background-color: @white-color-light;
            }
        }
        .group-row-right{
            margin-left: 54px;
            vertical-align: middle;
            color: @gray-color-light;
            .group-name {
                font-size: 14px;
                color: @gray-color-dark;
            }
            & > p {
                width: 100%;
            }
        }
    }
</style>

