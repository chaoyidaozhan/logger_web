<template>
    <div class="logger-list-item" ref="loggerListItem">
        <!--当前人信息-->
        <div class="logger-list-row clearfix logger-list-user">
            <fs-avatar
                class="avatar"
                size="40px"
                :avatar="loggerItemData.avatar" 
                :name="loggerItemData.userName"
                :fontSize="loggerItemData.userName ? '14px' : '20px'" 
            />
            <div class="logger-list-col clearfix">
                <span class="username">{{loggerItemData.userName}}</span>
                <span class="template-name" v-if="loggerItemData.templateName">
                    <i>{{filterEncode(loggerItemData.templateName)}}</i>
                </span>
                <span class="template-name" v-if="Math.abs(loggerItemData.diaryTime - loggerItemData.createTime) > 1000 * 60 * 60 * 48"><i>{{$t('operate.fill')}}</i></span>
                <i class="view-lower-level" 
                    v-if="isLowerLevel && !!loggerItemData.hasSubordinate"
                    @click="handleViewLowerLevel">
                    {{$t('operate.viewLowerLevelLog')}}
                </i>
                <div class="pull-right">
                    <span class="time">{{loggerItemData.createTime | filterDiaryUserTime}}</span>
                    <span class="data-type">{{dataSource[loggerItemData.dataType || 0]}}</span>
                    <Poptip placement="bottom-end" width="70">
                        <ul class="operate-tips" slot="content">
                            <li class="cursor-pointer" 
                                @click="handleEdit"
                                v-if="userInfo.member_id == loggerItemData.memberId">
                                {{$t('operate.edit')}}
                            </li>
                            <li class="cursor-pointer"
                                @click="handleDelete"
                                v-if="(userInfo.member_id == loggerItemData.memberId) || userInfo.admin">
                                {{$t('operate.delete')}}
                            </li>
                            <li class="cursor-pointer" 
                                @click="handlePrint"
                                v-if="((userInfo.member_id == loggerItemData.memberId) || userInfo.admin) && (this.$route.path != '/DraftOfMine')">
                                {{$t('operate.print')}}
                            </li>
                            <li class="cursor-pointer" v-if="this.$route.path != '/DraftOfMine'" @click="handleOperate">
                                {{$t('operate.operationRecord')}}
                            </li>
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
            <div class="logger-list-row logger-list-time" v-if="loggerItemData.diaryTimeStatus">
                <div class="logger-list-col">
                    <div class="title">
                        {{$t('noun.logDate')}}
                    </div>
                    <div class="caption">{{loggerItemData.diaryTime | filterDiaryTime}}</div>
                </div>
            </div>
            <!--具体内容-->
            <template v-if="typeof JSON.parse(loggerItemData.content) === 'object'">
                <logger-list-content-node
                    v-for="(item, index) in JSON.parse(loggerItemData.content)"
                    :data="item"
                    :key="index"
                    :filterEncode="filterEncode" />
            </template>
            <template v-else>
                <logger-list-content-node
                    :data="JSON.parse(loggerItemData.content)"
                    :filterEncode="filterEncode" />
            </template>
            
            <!--具体内容-->
            <div class="logger-list-row logger-list-content">
                <div class="logger-list-col">
                    <span class="at" v-for="(item, index) in loggerItemData.at" :key="index">
                        @{{item.replayUserName}}
                    </span>
                </div>
            </div>

            <!-- 附件 -->
            <div class="logger-list-row logger-list-attach">
                <div class="logger-list-col">
                    <fs-images :images="loggerItemAttachs.imgs"
                            v-if="loggerItemAttachs.imgs && loggerItemAttachs.imgs.length"></fs-images>
                    <fs-files :files="loggerItemAttachs.files"
                            v-if="loggerItemAttachs.files && loggerItemAttachs.files.length"></fs-files>
                </div>
            </div>
        </div>
        <div class="logger-list-row handle-content-expand-btn" v-if="contentRealHeight > contentDefaultHeight">
            <div class="logger-list-col">
                <span class="cursor-pointer more" @click="handleContentExpand" v-if="!contentExpand">
                    {{$t('operate.expand')}}
                </span>
                <span class="cursor-pointer more" @click="handleContentExpand" v-else>
                    {{$t('operate.collapse')}}
                </span>
            </div>
        </div>
        <div class="logger-list-row">
            <div class="logger-list-col logger-list-location">
                <Poptip
                    v-if="loggerItemData.readCount"
                    @on-popper-show="getAllMembers"
                    placement="right-end">
                    <div slot="content">
                        <div 
                            class="avatar-container"
                            v-for="(item, index) in members"
                            :key="index">
                            <fs-avatar
                                class="avatar member-card"
                                size="40px"
                                :avatar="item.avatar" 
                                :name="item.userName"
                                :fontSize="item.userName ? '14px' : '20px'" 
                            />
                            <span class="username">{{item.userName || ''}}</span>
                        </div>
                    </div>
                    <div class="count">{{loggerItemData.readCount}}{{$t('noun.peopleHaveSeen')}}</div>
                </Poptip>
                <div class="count" v-else>{{loggerItemData.readCount}}{{$t('noun.peopleHaveSeen')}}</div>
            </div>
        </div>
        <div class="logger-list-row" v-if="!!loggerItemData.location">
            <div class="logger-list-col logger-list-location">
                <Icon type="ios-location"></Icon>
                {{loggerItemData.location}}
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
                    <i class="icon-chat-normal" v-if="!showReply"></i>
                    <i class="icon-chat-selected" v-else></i>
                    {{loggerItemData.commentNum | filterCommentNum}}
                </span>
                <span class="cursor-pointer collect" 
                    :class="{active: loggerItemData.favorite.isFavorite}"
                    @click="handleCollect">
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
    </div>
</template>
<script>
import FormatTime from 'app_src/filters/format-time'
import FsAvatar from 'app_component/common/avatar/'
import FsReply from 'app_component/common/reply/'
import HTMLDeCode from 'app_src/filters/HTMLDeCode'
import FsFiles from './file'
import FsImages from './image'
import LoggerListContentNode from './content'
const rowHeight = 16
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
        },
        isLowerLevel: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            dataSource: [this.$t('noun.other'), 
            this.$t('noun.dailyReport'), this.$t('noun.weeklyReport'), this.$t('noun.monthlyReport'), this.$t('noun.other')],

            rangeHeight: '',
            rangeRealHeight: '',
            rangeDefaultHeight: rowHeight + 10,
            rangeExpand: false,

            contentHeight: '',
            contentRealHeight: '',
            contentDefaultHeight: rowHeight * 11,
            contentExpand: false,

            userInfo: this.$store.state.userInfo,

            showReply: false,
            editTimer: null,
            members: null
        }
    },
    components: {
        FsAvatar,
        FsReply,
        FsFiles,
        FsImages,
        LoggerListContentNode
    },
    filters: {
        filterDiaryTime(val) { // 格式化日志日期
            let timezone = 8, // 东八区
                offsetGMT = new Date().getTimezoneOffset(), // 本地时间和格林威治的时间差，单位为分钟
                nowDate = new Date(val).getTime(), // 日志时间距 1970 年 1 月 1 日午夜（GMT 时间）之间的毫秒数
                targetDate = new Date(nowDate + offsetGMT * 60 * 1000 + timezone * 60 * 60 * 1000)
            return FormatTime(new Date(targetDate), 'YYYY-MM-DD')
        },
        filterDiaryUserTime(val) { // 格式化日志日期
            return FormatTime(new Date(val), 'YYYY-MM-DD HH:mm')
        },
        filterCommentNum(val) { // 回复数量小于0
            let num = val < 0 ? 0: val
            return num
        }
    },
    computed: {
        loggerItemAttachs() { // 目前仅图片和文件类型
            let attachList = {
                imgs: [],
                files: []
            }
            let imgTypeArr = [".jpg", ".jpeg", ".png", ".pic", ".gif", ".bmp", ".svg", ".raw"]
            this.loggerItemData.fileStr.forEach((item) => {
                imgTypeArr.indexOf(item.fileExtension) >= 0
                ? attachList.imgs.push(item)
                : attachList.files.push(item)
            })
            return attachList
        }
    },
    methods: {
        getAllMembers() {
            this.$ajax({
                url: `/diaryReadLog/getDiaryReadLogList/${this.loggerItemData.id}`,
                success: (res)=>{
                    if(res && res.code == 0) {
                        this.members = res.data || []
                    }
                }
            })
        },
        setRangeHeight() { // 设置可展开的高度
            this.rangeRealHeight = this.$refs.rangeHeight && this.$refs.rangeHeight.offsetHeight
            this.contentRealHeight = this.$refs.contentHeight && this.$refs.contentHeight.offsetHeight
            this.rangeHeight = this.rangeDefaultHeight
            if(this.contentRealHeight > this.contentDefaultHeight) {
                this.contentHeight = this.contentDefaultHeight
            } else {
                this.contentHeight = this.contentRealHeight
            }
        },
        filterEncode(val) {
            return typeof val == 'string' ? (val ? HTMLDeCode(val.replace(/\n/g, '<br>')) : ''): val
        },
        handleViewLowerLevel() {
            this.$emit('handleViewLowerLevel', this.loggerItemData.memberId)
        },
        renderRange(loggerItemData) { // 可见范围控制
            let range = loggerItemData.range
            let str = `${this.$t('noun.visibleTo')}：`
            if(!range.length) {
                if(loggerItemData.visibleRange === 0) {
                    str += `${this.$t('noun.public')}`
                } else if (loggerItemData.visibleRange === 2) {
                    str += `${this.$t('noun.private')}`
                } else {
                    str = ''
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
                            break
                        case 4:
                            if(item.userName) {
                                str += `${item.userName } `
                            }
                            break
                        case 3:
                            if(item.teamName) {
                                str += `${item.teamName } `
                            }
                    }
                })
            }
            
            return str
        },
        handleCollect(e) { // 收藏
            e.stopPropagation()
            let uri = this.loggerItemData.favorite.isFavorite ? 
                    '/favorite/delete' : '/favorite/add'
                    
            this.loggerItemData.favorite.isFavorite = !!this.loggerItemData.favorite.isFavorite?0:1
            if(this.loggerItemData.favorite.isFavorite) {
                this.loggerItemData.favorite.favoriteNum += 1
            } else {
                this.loggerItemData.favorite.favoriteNum -= 1
            }
            this.$ajax({
                url: uri,
                type: 'post',
                data: {
                    diaryId: this.loggerItemData.id
                },
                requestBody: true,
                success: (res)=>{
                    if(res && res.code == 0) {
                        // this.loggerItemData.favorite = res.data
                        // if(this.loggerItemData.favorite) {
                        //     if(this.$parent.$parent.isFavorite) {
                        //         this.$parent.$parent.list.splice(this.index ,1)
                        //     }
                        // }
                        this.sendHasReadBrand()
                    }
                },
                error: (res)=>{
                    this.$Message.warning(this.$t('toast.operationFailed'))
                }
            })
        },
        handleLike(e) { // 点赞
            e.stopPropagation()
            this.loggerItemData.like.isLike = !!this.loggerItemData.like.isLike?0:1
            if(this.loggerItemData.like.isLike) {
                this.loggerItemData.like.likeNum += 1
            } else {
                this.loggerItemData.like.likeNum -= 1
            }

            this.$ajax({
                url: `/diaryLike/${this.loggerItemData.id}`,
                type: 'post',
                requestBody: true,
                success: (res)=>{
                    this.sendHasReadBrand()
                },
                error: (res)=>{
                    this.$Message.warning(this.$t('toast.operationFailed'))
                }
            })
        },
        sendHasReadBrand() { // 未读情况发送已读标记
            let root = this.$route.path
            console.log(root);
            
            if(!this.loggerItemData.isRead) {
                this.$ajax({
                    url: `/diaryReadLog/add`,
                    type: 'post',
                    requestBody: 1,
                    data: {
                        diaryId: this.loggerItemData.id
                    },
                    success: (res)=>{
                        if(res && res.code == 0) {
                            this.loggerItemData.readCount++
                            this.loggerItemData.isRead = 1
                            this.$eventbus.$emit('getUnreadCount')
                        }
                    }
                })
            }
        },
        handleRangeExpand() { // 范围展开操作
            this.rangeExpand = !this.rangeExpand
            if(this.rangeExpand) {
                this.rangeHeight = this.rangeRealHeight
            } else {
                this.rangeHeight = this.rangeDefaultHeight
            }
        },
        handleContentExpand() { // 全文展开操作
            this.contentExpand = !this.contentExpand
            if(this.contentExpand) {
                this.sendHasReadBrand()
            }
            if(this.contentExpand) {
                this.contentHeight = this.contentRealHeight
            } else {
                this.contentHeight = this.contentDefaultHeight
            }
        },
        handleEdit() {
            clearTimeout(this.editTimer)
            this.editTimer = setTimeout(()=>{
                this.$store.dispatch('update_template_content', { //登录成功更新store
                    content: this.loggerItemData
                }).then(()=>{
                    this.$router.push({
                        path: `LoggerDetail/operate/${this.$route.path == '/DraftOfMine' ? 'draft' : 'edit'}/${this.loggerItemData.id}`,
                        query:{
                            token:this.$store.state.userInfo.token
                        }
                    })
                })
            }, 400)
        },
        handleDelete() { // 删除
            this.$Modal.confirm({
                title: this.$t('toast.deleteLogPrompt'),
                content: this.$t('toast.clickOKToDeleteTheLog'),
                onOk: (res)=>{
                    this.$ajax({
                        url: `/diary/${this.loggerItemData.id}`,
                        type: 'delete',
                        success: (res)=>{
                            if(res && res.code == 0) {
                                this.$Message.success(this.$t('toast.successfullyDeleted'))
                                this.$emit('handleDelete', this.loggerItemData.id)
                            }
                        },
                        error: (res)=>{
                            this.$Message.error(res && res.msg || this.$t('status.networkError'))
                        }
                    })
                }
            })
            
        },
        handlePrint() { // 打印
            window.print()
        },
        handleOperate() { // 操作记录
            this.$ajax({
                url: `/diaryOpeationLoggers/${this.loggerItemData.id}`,
                success: (res)=>{
                    if(res && res.code == 0) {
                        this.$emit('handleOperateModal', res.data || [])
                    }
                },
                error: (res)=>{
                    this.sendHasReadBrand()
                    this.$Message.error(res && res.msg || this.$t('status.networkError'))
                }
            })
        },
        handleReply() { // 回复
            this.showReply = !this.showReply
        },
        handleReplyNum(type) {
            if(type) {
                this.loggerItemData.commentNum += 1
            } else {
                this.loggerItemData.commentNum -= 1
            }
        }
    },
    mounted () {
        this.$nextTick(()=>{
            this.setRangeHeight()        
        })
    }
}
</script>
<style lang="less">
@import '~app_assets/css/var.less';
@rowMarginBottom: 14px;
@titleMarginBottom: 4px;
.logger-list-item {
    padding: 20px 20px 0;
    position: relative;
    background-color: @white-color;
    color: @gray-color-light;
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
        background-color: @border-color-base;
    }
    .logger-list-row {
        line-height: 24px;
        word-break: break-all;
        &.logger-list-time {
            margin-bottom: @rowMarginBottom;
            .title {
                margin-bottom: @titleMarginBottom;
            }
        }
        .username {
            color: #111;
        }
        .avatar {
            float: left;
            &.member-card {
                margin: 5px;
            }
        }
        .avatar-container {
            float: left;
            text-align: center;
            width: 50px;
            .avatar {
                float: none;
            }
            .username {
                display: block;
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
        .logger-list-col {
            margin-left: 54px;
            .title {
                margin-bottom: @titleMarginBottom;
                color: @gray-color-dark;
            }
            .caption {
                font-size: 13px;
                color: @gray-color-medium;
            }
            .at {
                color: #289CF2;
                display: inline-block;
                margin-right: 4px;
                font-size: 13px;
            }
            .more {
                color: #289CF2;
                font-size: 13px;
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
                zoom: .8;
                padding: 4px 8px;
                display: block;
            }
        }
        .view-lower-level {
            font-size: 12px;
            padding: 0 12px 0 8px;
            cursor: pointer;
            background: url('../../../assets/images/view-lower-level.png') no-repeat right center;
            background-size: 12px;
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
            .ivu-poptip-rel {
                .icon-more {
                    vertical-align: middle;
                }
            }
            .ivu-poptip-popper {
                min-width: auto;
                left: auto!important;
                top: 17px!important;
                width: auto!important;
                right: -4px;
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
    .logger-list-location {
        font-size: 12px;
        color: @gray-color-light;
        position: relative;
        .ivu-poptip-popper {
            top: auto!important;
            bottom: 0;
        }
        .ivu-poptip {
            .count {
                cursor: pointer;
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
            overflow: hidden;
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
        position: relative;
        &:after {
            content: '';
            height: 10px;
            width: 100%;
            position: absolute;
            top: -10px;
            background: -webkit-linear-gradient(bottom, #ffffff 0, rgba(255, 255, 255, 0.4) 20%, rgba(255, 255, 255, 0) 100%);
        }
    }
    .lat {
        height: 10px;
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
            vertical-align: middle;
            i {
                font-size: 16px;
            }
            &.reply {
                i {
                    position: relative;
                    top: 2px;
                }
               
            }
            &.collect {
                border-right: 0;
            }
            &.active {
                color: #FFC400;
            }
        }
    }
    
}

.operate-modal {
    .ivu-modal-body {
        padding: 0 50px 10px;
        min-height: 340px;
        position: relative;
        &:before {
            position: absolute;
            left: 26px;
            content: '';
            top: -8px;
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

