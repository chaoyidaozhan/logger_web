<template>
    <div class="group-wrap" ref="groupWrap"  @scroll.stop="onScroll">
        <div class="group-item clearfix"
            :class="{active: (currentId == groupItem.groupId)}"
            v-for="groupItem in groupsData"
            :key="groupItem.groupId"
            @click="getDaily(groupItem)">
            <span class="hasNoRead" v-if="groupItem.hasNoRead"></span>
            <avatar class="pull-left"
                    fontSize="20px" 
                    :avatar="groupItem.logo" 
                    :name="groupItem.groupName" 
                    type="group"></avatar>
            <div class="group-row-right">
                <p class="ellipsis group-name">{{groupItem.groupName}} ({{groupItem.groupMemberCount}})人</p>
                <p class="ellipsis">{{groupItem.diaryNum}}{{$t('noun.article')}}{{$t('noun.log')}</p>
                <p class="ellipsis">{{groupItem.lastUpdateTime}}{{$t('operate.updated')}}</p>
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
            pageSize: 100,
            pageNo: 1,
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
        pageNo: "loadData"
    },
    methods: {
        loadData() {
            this.loading = true;
            this.$ajax({
                url: '/diaryQuery/getGeneralGroupDiary',
                type: 'get',
                data: {
                    pageNo: this.pageNo,
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
                    item.lastUpdateTime = FormatTime(new Date(item.lastUpdateTime || new Date()), "YYYY-MM-DD");
                });
                if(this.pageNo === 1) {
                    this.groupsData = res.data || [];
                    this.currentId = this.groupsData[0] && this.groupsData[0].groupId;
                    this.$emit("getDaily", typeof this.currentId === "undefined" ? "" : this.currentId);
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
                    this.pageNo++;
                }
            }
        },
        getDaily(params) {
            this.currentId = params.groupId;
            params.hasNoRead = 0;
            this.$emit("getDaily", typeof this.currentId === "undefined" ? "" : this.currentId);
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
            position: relative;
            padding: 10px;            
            cursor: pointer;
            &.active {
                background-color: @white-color-light;
            }
            .hasNoRead {
                display: inline-block;
                position: absolute;
                top: 10px;
                left: 40px;
                content: "";
                width: 7px;
                height: 7px;
                border-radius: 50%;
                background-color: #fa4f52;
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

