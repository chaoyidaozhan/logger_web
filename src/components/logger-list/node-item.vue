<template>
    <div class="logger-list-item" ref="loggerListItem">
        <!--当前人信息-->
        <div class="logger-list-row clearfix logger-list-user">
            <fs-avatar
                class="avatar"
                :avatar="loggerItemData.avatar" 
                :name="loggerItemData.userName"
            />
            <div class="logger-list-col clearfix">
                <span class="username">{{loggerItemData.userName}}</span>
                <span class="template-name" v-if="loggerItemData.templateName">{{loggerItemData.templateName}}</span>
                <div class="pull-right">
                    <span class="time">{{loggerItemData.createTime | filterDiaryUserTime}}</span>
                    <span class="data-type">{{dataSource[loggerItemData.dataType || 0]}}</span>
                    <Poptip placement="bottom-end" width="70">
                        <ul class="operate-tips" slot="content">
                            <li class="cursor-pointer" 
                                v-if="userInfo.member_id == loggerItemData.memberId">
                                编辑
                            </li>
                            <li class="cursor-pointer"
                                @click="handleDelete"
                                v-if="(userInfo.member_id == loggerItemData.memberId) || userInfo.admin">
                                删除
                            </li>
                            <li class="cursor-pointer" @click="`handlePrint`">打印</li>
                            <li class="cursor-pointer">操作记录</li>
                        </ul>
                        <span class="operate cursor-pointer"><Icon type="more"></Icon></span>
                    </Poptip>
                </div>
            </div>
        </div>
        <!--可见范围-->
        <div class="logger-list-row logger-list-range">
            <div class="logger-list-col" 
                :class="{'ellipsis': (!rangeExpand && rangeRealHeight > rangeDefaultHeight)}" 
                :style="{'height': `${rangeHeight}px` }"
                ref="rangeHeight">
                {{renderRange(loggerItemData)}}
                <span v-if="rangeRealHeight > rangeDefaultHeight" class="expand cursor-pointer" @click="handleRangeExpand">
                    <Icon v-if="rangeExpand" type="chevron-up"></Icon>
                    <Icon v-else type="chevron-down"></Icon>
                </span>
            </div>
        </div>
        <!-- 控制展开收起 -->
        <div class="handle-content-expand" 
            ref="contentHeight" 
            :style="{'height': `${contentHeight}px` }">
            <div class="logger-list-row logger-list-time">
                <div class="logger-list-col">
                    <div class="title">日志日期</div>
                    <div class="caption">{{loggerItemData.diaryTime | filterDiaryTime}}</div>
                </div>
            </div>
            <!--具体内容-->
            <div class="logger-list-row logger-list-content"
                v-for="(item, index) in JSON.parse(loggerItemData.content)"
                :key="index">
                <div class="logger-list-col">
                    <div class="title">{{item.title}}</div>
                    <div class="caption">{{item.content || item.value}}</div>
                </div>
            </div>
        </div>
        <div class="logger-list-row handle-content-expand-btn" v-if="contentRealHeight > contentDefaultHeight">
            <div class="logger-list-col">
                <span class="cursor-pointer" @click="handleContentExpand" v-if="!contentExpand">展开全文</span>
                <span class="cursor-pointer" @click="handleContentExpand" v-else>收起全文</span>
            </div>
        </div>
        <!--点赞回复收藏-->
        <div class="logger-list-row logger-list-operate">
            <div class="logger-list-col">
                <span class="cursor-pointer reply">
                    {{loggerItemData.commentNum}}个回复
                </span>
                <span class="cursor-pointer collect" @click="handleCollect">
                    {{loggerItemData.favorite && loggerItemData.favorite.favoriteNum}}收藏
                </span>
                <span class="cursor-pointer like" @click="handleLike">
                    {{loggerItemData.like && loggerItemData.like.likeNum}}个赞
                </span>
            </div>
        </div>
    </div>
</template>
<script>
import FormatTime from 'app_src/filters/format-time';
import FsAvatar from 'app_component/common/avatar/';
const rowHeight = 24
export default {
    props: {
        loggerItemData: {
            type: Object
        }
    },
    data() {
        return {
            dataSource: ["其他", "日报", "周报", "月报", "其他"],
            rangeHeight: '',
            rangeRealHeight: '',
            rangeDefaultHeight: rowHeight + 2,
            rangeExpand: false,

            contentHeight: '',
            contentRealHeight: '',
            contentDefaultHeight: rowHeight * 7,
            contentExpand: false,
            userInfo: this.$store.state.userInfo
        }
    },
    components: {
        FsAvatar
    },
    filters: {
        filterDiaryTime(val) { // 格式化日志日期
            return FormatTime(new Date(val), 'YYYY-MM-DD')
        },
        filterDiaryUserTime(val) { // 格式化日志日期
            return FormatTime(new Date(val), 'MM-DD HH:mm')
        }
    },
    methods: {
        setRangeHeight() { // 设置可展开的高度
            this.rangeRealHeight = this.$refs.rangeHeight.offsetHeight;
            this.contentRealHeight = this.$refs.contentHeight.offsetHeight;

            this.rangeHeight = this.rangeDefaultHeight;
            if(this.contentRealHeight > this.contentDefaultHeight) {
                this.contentHeight = this.contentDefaultHeight;
            } else {
                this.contentHeight = this.contentRealHeight;
            }
        },
        renderRange(loggerItemData) { // 可见范围控制
            let range = loggerItemData.range;
            let str = '可见范围：'
            if(!range.length) {
                if(loggerItemData.visibleRange === 0) {
                    str += '所有人可见';
                } else if (loggerItemData.visibleRange === 2) {
                    str += '仅自己可见';
                } else {
                    str = '';
                }
            } else {
                range.forEach(item=>{
                    switch(+item.dataType) {
                        case 1:
                            if(item.teamName) {
                                str += `${item.teamName } `
                            } else {
                                if(this.$store.state.userInfo.dept_id === 0) {
                                    str += `${item.spaceName } `
                                }
                            }
                            break;
                        case 4:
                            if(item.userName) {
                                str += `${item.userName } `
                            }
                            break;
                        case 3:
                            if(item.teamName) {
                                str += `${item.teamName } `
                            }
                    }
                })
            }
            
            return str;
        },
        handleCollect(e) {
            e.stopPropagation();
            let uri = this.loggerItemData.favorite.isFavorite ? 
                    '/logger/favorite/delete' : '/logger/favorite/add'
            this.$ajax({
                url: uri,
                type: 'post',
                data: {
                    diaryId: this.loggerItemData.id
                },
                success: (res)=>{
                    if(res && res.code == 0) {
                        this.loggerItemData.favorite = res.data;
                    }
                },
                error: (res)=>{
                    this.$Message.warning('操作失败');
                }
            })
        },
        handleLike(e) {
            e.stopPropagation();
            this.$ajax({
                url: `/logger/diaryLike/${this.loggerItemData.id}`,
                type: 'post',
                success: (res)=>{
                    if(res && res.code == 0) {
                        this.loggerItemData.like.likeNum = res.data.likeTotal;
                        this.loggerItemData.like.isLike = !!this.loggerItemData.like.isLike?0:1;
                    } 
                },
                error: (res)=>{
                    this.$Message.warning('操作失败');
                }
            })
        },
        handleRangeExpand() { // 范围展开操作
            this.rangeExpand = !this.rangeExpand;
            if(this.rangeExpand) {
                this.rangeHeight = this.rangeRealHeight;
            } else {
                this.rangeHeight = this.rangeDefaultHeight;
            }
        },
        handleContentExpand() { // 全文展开操作
            this.contentExpand = !this.contentExpand;
            if(this.contentExpand) {
                this.contentHeight = this.contentRealHeight;
            } else {
                this.contentHeight = this.contentDefaultHeight;
            }
        },
        handlePrint() {
            window.print();
        },
        handleDelete() {
            this.$Modal.warning({
                title: '删除日志提示',
                content: '确定删除该日志么',
                onOk: (res)=>{
                    this.$ajax({
                        url: `/logger/diary/${this.loggerItemData.id}`,
                        type: 'delete',
                        error: (res)=>{
                            this.$Message.error(res && res.msg || '网络错误')
                        }
                    })
                },
                onCancel: (res)=>{}
            });
            
        }
    },
    mounted () {
        this.setRangeHeight();
    }
}
</script>
<style lang="less">
@import '../../assets/css/var.less';
.logger-list-item {
    padding: 20px 20px 0;
    transition: .2s ease all;
    position: relative;
    background-color: @white-color;
    color: @gray-color-dark;
    font-size: 14px;
    &.fade-enter {
        opacity: 0;
    }
    &.fade-enter-in {
        opacity: 1;
    }
    &:after {
        position: absolute;
        left: 74px;
        height: 1px;
        right: 0;
        bottom: 0;
        content: '';
        background-color: @gray-color-elip;
    }
    .logger-list-row {
        line-height: 24px;
        word-break: break-all;
        .avatar {
            float: left;
        }
        .logger-list-col {
            margin-left: 54px;
            .title {
                color: @gray-color-light;
            }
            .caption {
            }
        }
    }
    .logger-list-user {
        line-height: 24px;
        .template-name {
            border: 1px solid @primary-color;
            color: @primary-color;
            border-radius: 3px;
            padding: 3px 6px;
            transform: scale(0.8);
            display: inline-block;
            line-height: 12px;
        }
        .pull-right {
            color: @gray-color-light;
            font-size: 0;
            span {
                font-size: 12px;
                margin-left: 8px;
                &.operate {
                    font-size: 14px;
                }
            }
            .ivu-poptip {
                position: relative;
            }
            .ivu-poptip-popper {
                min-width: auto;
                left: -45px!important;
                top: 17px!important;
                .ivu-poptip-arrow {
                    right: 6px;
                }
            }
            .ivu-poptip-body {
                padding: 0;
            }
            .operate-tips {
                line-height: 32px;
                li {
                    color: @text-color;
                    padding: 0 10px;
                    margin: 1px;
                    transition: .2 ease all;
                    &:hover {
                        background-color: @white-color-light;
                        color: @primary-color;
                    }
                }
            }
        }
    }
    .logger-list-range {
        font-size: 12px;
        color: @gray-color-light;
        margin-top: -20px;
        margin-bottom: 10px;
        position: relative;
        .logger-list-col {
            padding: 1px 0;
            transition: .2s ease height;
        }
        .expand {
            font-size: 12px;
            height: 20px;
            line-height: 20px;
        }
        .ellipsis {
            padding-right: 20px;
            .expand {
                position: absolute;
                right: 8px;
                top: 3px;
            }
        }
    }
    .logger-list-time {
        // margin-bottom: 5px;
    }
    .handle-content-expand {
        overflow: hidden;
        transition: .2s ease height;
    }
    .handle-content-expand-btn {
        color: @primary-color;
    }
    .logger-list-operate {
        font-size: 0;
        margin-top: 20px;
        padding-bottom: 8px;
        span {
            display: inline-block;
            margin-right: 10px;
            font-size: 12px;
            color: @gray-color-light;
            height: 20px;
            line-height: 20px;
            padding: 0 34px;
            border-right: 1px solid @border-color;
            &.like {
                border-right: 0;
            }
        }
    }
}
</style>

