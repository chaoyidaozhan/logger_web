<template>
    <div class="group-wrap" ref="groupWrap"  @scroll.stop="onScroll">
        <div class="group-item"
            :class="{active: (currentId == groupItem.groupId)}"
            v-for="groupItem in groupsData"
            :key="groupItem.groupId"
            @click="getDaily(groupItem)">
            <avatar :avatar="groupItem.logo"></avatar>
            <div class="group-row-right">
                <p class="ellipsis group-name">{{groupItem.groupName}} ({{groupItem.groupMemberCount}})人</p>
                <p class="ellipsis">{{groupItem.diaryNum}}篇日志</p>
                <p class="ellipsis">{{groupItem.lastUpdateTime}}更新</p>
            </div>
        </div>
        <div class="loading">
            <div class="loading-content">
                <Spin>
                    <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                    <span>正在加载中...</span>
                </Spin>
            </div>
            <div class="loading-content">已加载全部数据</div>
        </div>
    </div>
</template>
<script>
import Avatar from '../avatar';
import FormatTime  from 'app_src/filters/format-time';
import Ps from 'perfect-scrollbar';
export default {
    data() {
        return {
            pageSize: 100,
            pageNum: 1,
            groupsData: [],
            currentId: '',
            loading: false,
            loaderror: false,
            hasMore: true
        }
    },
    components: {
        Avatar
    },
    methods: {
        loadData() {
            this.$ajax({
                url: '/logger/diaryQuery/getGeneralGroupDiary',
                type: 'get',
                data: {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                },
                success: (res)=>{
                    if(res && res.code === 0) {
                        this.groupsData = res.data || [];
                        this.groupsData.forEach((item)=>{
                            item.lastUpdateTime = FormatTime(new Date(item.lastUpdateTime), "YYYY-MM-DD");
                        });
                        this.initScroll();
                    } else {
                        this.$Message.warning((res && res.msg) || '网络错误');
                    }
                },
                error: (res)=>{
                    this.$Message.error((res && res.msg) || '网络错误');
                }
            });
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
        watch: {
            pageNum: "loadData"
        },
        onScroll(e) {
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
        getDaily(params) {
            this.currentId = params.groupId;
            this.$emit("getDaily", params);
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
        width: 240px;
        height: 100%;        
        font-size: 12px;
        line-height: 20px;
        background-color: @white-color;
        .group-item {
            padding: 10px 15px;            
            cursor: pointer;
            &.active {
                background-color: @white-color-light;
            }
        }
        .group-row-right{
            display: inline-block;
            margin-left: 10px;
            vertical-align: middle;
            color: @gray-color-light;
            .group-name {
                font-size: 14px;
                color: @gray-color-dark;
            }
            &>p {
                width: 130px;
            }
        }
        .loading {
            height: 60px;
            line-height: 50px;
            text-align: center;
            font-size: 14px;
            background-color: @white-color-lighter;
            color: @gray-color-light;
            position: relative;
            overflow: hidden;
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

