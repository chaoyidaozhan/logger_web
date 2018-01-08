<template>
    <div class="logger-list-item" ref="loggerListItem">
        <!--当前人信息-->
        <div class="logger-list-row clearfix logger-list-user">
            <fs-avatar
                class="avatar"
                :avatar="loggerItemData.avatar" 
                :name="loggerItemData.userName"
                :fontSize="loggerItemData.userName ? '14px' : '20px'" 
            />
            <div class="logger-list-col clearfix">
                <span class="username">{{loggerItemData.userName}}</span>
                <span class="template-name" v-if="loggerItemData.templateName">
                    <i>{{loggerItemData.templateName}}</i>
                </span>
                <div class="pull-right">
                    <span class="time">{{loggerItemData.createTime | filterDiaryUserTime}}</span>
                    <span class="data-type">{{dataSource[loggerItemData.dataType || 0]}}</span>
                    <Poptip placement="bottom-end" width="70">
                        <ul class="operate-tips" slot="content">
                            <li class="cursor-pointer" 
                                @click="handleEdit"
                                v-if="userInfo.member_id == loggerItemData.memberId">
                                编辑
                            </li>
                            <li class="cursor-pointer"
                                @click="handleDelete"
                                v-if="(userInfo.member_id == loggerItemData.memberId) || userInfo.admin">
                                删除
                            </li>
                            <li class="cursor-pointer" @click="handlePrint">打印</li>
                            <li class="cursor-pointer" @click="handleOperate">操作记录</li>
                        </ul>
                        <span class="operate cursor-pointer"><i class="icon-more"></i></span>
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
                    <div class="caption" v-html="filterEncode(item.content || item.value)"></div>
                </div>
            </div>
        </div>
        <div class="logger-list-row handle-content-expand-btn" v-if="contentRealHeight > contentDefaultHeight">
            <div class="logger-list-col">
                <span class="cursor-pointer" @click="handleContentExpand" v-if="!contentExpand">展开全文</span>
                <span class="cursor-pointer" @click="handleContentExpand" v-else>收起全文</span>
            </div>
        </div>
        <div class="lat"></div>
        <!--点赞回复收藏-->
        <div class="logger-list-row logger-list-operate" v-if="!isDraft">
            <div class="logger-list-col">
                <span class="cursor-pointer like" :class="{active: loggerItemData.like.isLike}" @click="handleLike">
                    <i class="icon-good-normal" v-if="!loggerItemData.like.isLike"></i>
                    <i class="icon-good-selected" v-else></i>
                    {{loggerItemData.like && loggerItemData.like.likeNum}}
                </span>
                <span class="cursor-pointer reply" :class="{active: showReply}"  @click="handleReply">
                    <i class="icon-chat-normal"></i>
                    {{loggerItemData.commentNum}}
                </span>
                <span class="cursor-pointer collect" :class="{active: loggerItemData.favorite.isFavorite}" @click="handleCollect">
                    <i class="icon-collect-normal" v-if="!loggerItemData.favorite.isFavorite"></i>
                    <i class="icon-collect-selected" v-else></i>
                    {{loggerItemData.favorite && loggerItemData.favorite.favoriteNum}}
                </span>
            </div>
        </div>
        <div class="logger-list-row">
            <div class="logger-list-col">
                <fs-reply v-if="showReply"
                    @handleReplyNum="handleReplyNum"
                    :dailyId="loggerItemData.id"/>
            </div>
        </div>
        <!--操作记录弹层-->
        <Modal
            v-model="operateModal"
            class="operate-modal"
            title="操作记录">   
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
import FormatTime from 'app_src/filters/format-time';
import FsAvatar from 'app_component/common/avatar/';
import FsReply from 'app_component/common/reply/';
import HTMLDeCode from 'app_src/filters/HTMLDeCode';
const rowHeight = 24;
export default {
    props: {
        loggerItemData: {
            type: Object
        },
        index: {
            type: Number
        },
        isDraft: {
            type: Boolean,
            default: false
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

            userInfo: this.$store.state.userInfo,
            operateModal: false,
            operateModalData: [],

            showReply: false
        }
    },
    components: {
        FsAvatar,
        FsReply
    },
    filters: {
        filterDiaryTime(val) { // 格式化日志日期
            return FormatTime(new Date(val), 'YYYY-MM-DD')
        },
        filterDiaryUserTime(val) { // 格式化日志日期
            return FormatTime(new Date(val), 'MM-DD HH:mm')
        },
    },
    methods: {
        setRangeHeight() { // 设置可展开的高度
            this.rangeRealHeight = this.$refs.rangeHeight && this.$refs.rangeHeight.offsetHeight;
            this.contentRealHeight = this.$refs.contentHeight && this.$refs.contentHeight.offsetHeight;

            this.rangeHeight = this.rangeDefaultHeight;
            if(this.contentRealHeight > this.contentDefaultHeight) {
                this.contentHeight = this.contentDefaultHeight;
            } else {
                this.contentHeight = this.contentRealHeight;
            }
        },
        filterEncode(val) {
            return val ? HTMLDeCode(val.replace(/\n/g, '<br>')) : ''
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
        handleCollect(e) { // 收藏
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
                        if(this.loggerItemData.favorite) {
                            if(this.$parent.$parent.isFavorite) {
                                this.$parent.$parent.list.splice(this.index ,1);
                            }
                        }
                    }
                },
                error: (res)=>{
                    this.$Message.warning('操作失败');
                }
            })
        },
        handleLike(e) { // 点赞
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
        handleEdit(){
            this.$store.dispatch('update_template_content', { //登录成功更新store
                content: this.loggerItemData
            }).then(()=>{
                this.$router.push({
                    path: `LoggerDetail/operate/edit/${this.loggerItemData.id}`,
                    query:{
                        token:this.$store.state.userInfo.token
                    }
                });
            });
        },
        handleDelete() { // 删除
            this.$Modal.confirm({
                title: '删除日志提示',
                content: '点击确定删除该日志',
                onOk: (res)=>{
                    this.$ajax({
                        url: `/logger/diary/${this.loggerItemData.id}`,
                        type: 'delete',
                        success: (res)=>{
                            if(res && res.code == 0) {
                                this.$Message.success('删除成功！');
                                this.$emit('handleDelete', this.loggerItemData.id);
                            }
                        },
                        error: (res)=>{
                            this.$Message.error(res && res.msg || '网络错误')
                        }
                    })
                }
            });
            
        },
        handlePrint() { // 打印
            window.print();
        },
        handleOperate() { // 操作记录
            this.$ajax({
                url: `/logger/diaryOpeationLoggers/${this.loggerItemData.id}`,
                success: (res)=>{
                    if(res && res.code == 0) {
                        this.operateModalData = res.data || [];
                        this.operateModal = true;
                    }
                },
                error: (res)=>{
                    this.$Message.error(res && res.msg || '网络错误')
                }
            })
        },
        handleReply() { // 回复
            this.showReply = !this.showReply;
        },
        handleReplyNum(type) {
            if(type) {
                this.loggerItemData.commentNum += 1;
            } else {
                this.loggerItemData.commentNum -= 1;
            }
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
    position: relative;
    background-color: @white-color;
    color: @gray-color-dark;
    font-size: 14px;
    &.fade-enter {
        transition: .2s ease opacity;
        opacity: 0;
    }
    &.fade-enter-in {
        opacity: 1;
    }
    &:after {
        position: absolute;
        left: 74px;
        height: 1px;
        right: 20px;
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
        }
    }
    .logger-list-user {
        line-height: 24px;
        .template-name {
            border: 1px solid @primary-color;
            color: @primary-color;
            border-radius: 2px;
            display: inline-block;
            i {
                font-style: normal;
                padding: 1px 0;
                line-height: 12px;
                transform: scale(0.8);
                display: block;
            }
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
    .handle-content-expand {
        overflow: hidden;
        transition: .2s ease height;
    }
    .handle-content-expand-btn {
        color: @primary-color;
    }
    .lat {
        height: 20px;
    }
    .logger-list-operate {
        font-size: 0;
        padding-bottom: 8px;
        ::selection{
            background-color: transparent;
        }
        span {
            display: inline-block;
            margin-right: 10px;
            font-size: 12px;
            color: @gray-color-light;
            height: 20px;
            line-height: 20px;
            padding: 0 34px;
            border-right: 1px solid @border-color;
            i {
                font-size: 14px;
            }
            &.reply {
                i {
                    position: relative;
                    top: 2px;
                }
                &.active {
                    color: @primary-color;
                }
            }
            &.collect {
                border-right: 0;
                &.active {
                    color: @collect-color;
                }
            }
            &.like {
                &.active {
                    color: @like-color;
                }
            }
        }
    }
    
}
.operate-modal {
    .ivu-modal-body {
        padding: 0 50px;
        min-height: 340px;
        max-height: 340px;
        position: relative;
        &:before {
            position: absolute;
            left: 26px;
            content: '';
            top: 0;
            bottom: 0;
            width: 1px;
            background-color: @border-color;
        }
        .operate-row {
            line-height: 20px;
            font-size: 14px;
            padding: 12px;
            margin-top: 10px;
            border-radius: 4px;
            background-color: @white-color-light;
            position: relative;
            &:before {
                position: absolute;
                content: '';
                left: -26px;
                top: 15px;
                width: 5px;
                height: 5px;
                border-radius: 50%;
                background-color: @gray-color-normal;
            }
            &:after {
                position: absolute;
                content: '';
                width: 0;
                border-style: solid;
                border-width: 8px 8px 8px 0;
                border-color: transparent @white-color-light transparent @white-color-light;
                left: -7px;
                top: 10px;
            }
            &:first-child {
                &:before {
                    background-color: @primary-color;
                }
            }
            .operate-avatar {
                float: left;
                margin-top: 4px;
            }
            .operate-content {
                margin-left: 41px;
                .clearfix {
                    color: @gray-color-light;
                    height: 20px;
                }
                .pull-right {
                    font-size: 12px;
                }
            }
        }
    }
    .ivu-modal-header p, .ivu-modal-header-inner {
        font-weight: normal;
    }
    .ivu-modal-footer {
        display: none;
    }
}
</style>

