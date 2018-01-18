<template>
    <transition name="fade">
        <div class="reply-wrapper">
            <div class="input">
                <textarea 
                    ref="replyWrapper" 
                    type="textarea" 
                    v-model="value" 
                    placeholder="发表您的评论" 
                    @keyup="handleKeyUp"/>
                <p class="input-number">
                    <span :class="{exceed: value.length >= 200}">{{value.trim().length}}</span>
                    <span>/{{maxLength}}</span>
                </p>
            </div>

            <div class="comment-btn clearfix">
                <i class="icon-expression face-btn" 
                   @click="chooseFace"></i>
                <i class="file-btn icon-enclosure" @click="uploadFile"></i>
                <Button class="ok-btn" 
                        type="primary" 
                        :disabled="!value.trim().length"
                        @click="commitComment">
                    回复
                </Button>
                <emoji class="emoji" 
                       v-if="showFace"
                       @handleFace="handleFace"></emoji>            
            </div>

            <fs-file-upload ref="fileUpload" @sendFileData="getUploadFile"/>

            <div class="comment-list">
                <transition-group name="fade-list" tag="div">
                    <div class="comment-item"
                        v-for="commentItem in commentListData" 
                        :key="commentItem.id">
                        <avatar :avatar="commentItem.user.avatar" 
                                :name="commentItem.userName"
                                size="36px"></avatar>

                        <div class="comment-content">
                            <p class="names">
                                <span class="username">{{commentItem.userName}}</span>
                                <span class="text"
                                    v-if="commentItem.replyUserName">回复</span>
                                <span class="reply-username"
                                    v-if="commentItem.replyUserName">{{commentItem.replyUserName}}</span>
                            </p>

                            <div class="content">
                                <p class="reply-text" v-html="commentItem.content"></p>
                                <div class="reply-attach-list">
                                    <fs-file class="file-wrapper"
                                             :files="commentItem.attachList.files"
                                             v-if="commentItem.attachList.files && commentItem.attachList.files.length"></fs-file>
                                    <fs-image class="image-wrapper" 
                                              :images="commentItem.attachList.imgs"
                                              v-if="commentItem.attachList.imgs && commentItem.attachList.imgs.length"></fs-image>
                                    <fs-audio class="audio-wrapper"
                                              :audios="commentItem.attachList.audios"
                                              v-if="commentItem.attachList.audios && commentItem.attachList.audios.length"></fs-audio>
                                    <fs-video class="video-wrapper"
                                              :videos="commentItem.attachList.videos"
                                              v-if="commentItem.attachList.videos && commentItem.attachList.videos.length"></fs-video>
                                </div>
                            </div>

                            <p class="operate">
                                <span>{{commentItem.createTime}}</span>
                                <span class="reply"
                                    v-show="!commentItem.isMyself"
                                    @click="replySomebody(commentItem)">回复</span>
                                <span class="del"
                                    v-show="commentItem.isMyself"
                                    @click="deleteSingleComment(commentItem)">删除</span>
                            </p>
                        </div>
                    </div>
                </transition-group>
                <loading :loading="loading"
                         :loadError="loadError"
                         :hasMore="hasMore"
                         :loadMore="loadMore"
                         @handleLoadMore="handleLoadMore"
                         @handleReload="handleReload">
                </loading>
            </div>
        </div>
    </transition>
</template>

<script>
    import emoji from '../emoji/';
    import avatar from '../avatar/';
    import formatTime from 'app_src/filters/friendly-time';
    import loading from '../loading-scroll/';
    import FsVideo from './video.vue';
    import FsAudio from './audio.vue';
    import FsFile from './file.vue';
    import FsImage from './image.vue';
    import FsFileUpload from './file_upload.vue';
    import HTMLDeCode from 'app_src/filters/HTMLDeCode';

    const FACE_ARR = ['[龇牙]', '[哈哈]', '[色]', '[可怜]', '[晕]', '[汗]', '[害羞]', 
                    '[调皮]', '[疑问]', '[闭嘴]', '[得意]', '[流泪]', '[愉快]', '[难过]', '[困]', 
                    '[生病]', '[笑cry]', '[尴尬]', '[偷笑]', '[奋斗]', '[赞]', '[握手]', '[OK]', 
                    '[yeak]','[鼓掌]', '[拳头]', '[肌肉]', '[握拳]', '[拜托]', '[祈祷]', '[踩]', 
                    '[亲亲]', '[嘘]', '[大哭]', '[发呆]', '[困Zzz]', '[思考]', '[白眼]', '[傲慢]',
                    '[酷]', '[囧]', '[鄙视]', '[饥饿]', '[吓]', '[抠鼻]', '[惊讶]', '[发怒]', 
                    '[惊恐]', '[吐]', '[拜拜]', '[给力]', '[咖啡]', '[下雨]', '[闪电]', '[下雪]', 
                    '[足球]', '[篮球]', '[飞机]', '[邮件]', '[雨伞]', '[奖杯]', '[怪物]', '[药]', 
                    '[炸弹]', '[蛋糕]'];
    export default {
        components: {
            emoji,
            avatar,
            loading,
            FsVideo,
            FsAudio,
            FsFile,
            FsImage,
            FsFileUpload
        },
        props: {
            dailyId: {
                type: Number,
                required: true
            }
        },
        data() {
            return {
                value: '',
                maxLength: 200,
                showFace: false,
                pageNo: 1,
                pageSize: 10,
                commentListData: [],
                loading: true,
                loadError: false,
                hasMore: true,
                loadMore: false,
                loadTimer: null,
                commitTimer: null,
                replyData: {
                    diaryId: this.dailyId,
                    replySource: 3
                }
            }
        },
        methods: {
            handleKeyUp() { // 键盘监听
                let inputContent = this.value.trim();
                if(inputContent.length >= this.maxLength) {
                    this.value = inputContent.substring(0, this.maxLength);
                }
            },
            chooseFace(e) { // 表情展开
                e.stopPropagation();
                this.showFace = !this.showFace;
            },
            uploadFile() { // 上传附件
                this.$refs.fileUpload.$el.getElementsByClassName("ivu-upload-input")[0].click();
            },
            handleFace(faceItem) { // 表情点击
                this.value += "[" + faceItem + "]";             
                let inputContent = this.value.trim();
                if(inputContent.length >= this.maxLength) {
                    this.value = inputContent.substring(0, this.maxLength);
                }
                this.$refs.replyWrapper.focus();
            },
            filterContent(content) { // 匹配回复内容表情
                let matchedFace = content.match(/\[.{1,5}?\]/mg) || [];
                let finalFace = [];
                matchedFace.forEach((item) => {
                    for(let i = 0, j = FACE_ARR.length; i < j; i++){
                        if (FACE_ARR[i] === item) {
                            finalFace.push(item);
                            break;
                        }
                    }
                });
                finalFace.forEach((item) => {
                    content = content.replace(item, '<i exp="' + item.replace(/\[|\]/g,"") + '"></i>');
                });
                return content;
            },
            getUploadFile(fileData) { // 获取上传附件
                this.replyData.fileStr = JSON.stringify(fileData);
            },
            replySomebody(commentItem) {
                this.replyData.replyCommentId = commentItem.memberId;
                this.replyData.replyUserName = commentItem.userName;
                this.$refs.replyWrapper.focus();
                this.value = `回复${commentItem.userName}:`;
            },
            filterContentAttach(attachs) { // 过滤附件
                let attachList = {
                    imgs: [],
                    audios: [],
                    videos: [],
                    files: []
                };
                attachs.forEach((item) => {
                    switch(item.type){
                        case "img":
                            attachList.imgs.push(item);
                            break;
                        case "audio":
                            item.audioClass = "audio3";
                            attachList.audios.push(item);
                            break;
                        case "video":
                            attachList.videos.push(item);
                            break;
                        default:
                            if(item.fileext === ".mp4"
                             || item.fileext === ".webm"
                             || item.fileext === ".ogv") {
                                attachList.videos.push(item);
                            }else {
                                attachList.files.push(item);
                            }
                    }
                });
                return attachList;
            },
            updateList(commentData) {
                commentData.forEach((item) => {
                    item.createTime = formatTime(item.createTime);
                    item.isMyself = item.memberId === +this.$store.state.userInfo.member_id;
                    item.content = HTMLDeCode(this.filterContent(item.content).replace(/\n/g, '<br>'));
                    item.attachList = this.filterContentAttach(item.replyCommentFileList);
                });
                this.pageNo === 1
                            ? this.commentListData = commentData
                            : this.commentListData = this.commentListData.concat(commentData);
                if(commentData.length < this.pageSize) {
                    this.hasMore = false;
                    this.loadMore = false;
                }else {
                    this.loadMore = true;
                }
            },
            loadCommentData() { // 获取回复列表
                this.loading = true;
                this.loadMore = false;
                clearTimeout(this.loadTimer);
                this.loadTimer = setTimeout(() => {
                    this.$ajax({
                        url: `/logger/diaryComment/${this.dailyId}/reply`,
                        type: 'get',
                        data: {
                            pageNo: this.pageNo,
                            pageSize: this.pageSize
                        },
                        success: (res)=>{
                            if(res && res.code === 0) {
                                this.loading = false;
                                this.updateList(res.data.replyList || []);
                            } else {
                                this.loadError = true;
                                this.loading = false;
                            }
                        },
                        error: (res)=>{
                            this.loadError = true;
                            this.loading = false;
                        }
                    });
                }, 200);
            },
            commitComment() { // 提交回复
                this.replyData.content = this.value.replace(/^回复[^:]+?:/, "");
                clearTimeout(this.commitTimer);
                this.commitTimer = setTimeout(() => {
                    this.$ajax({
                        url: '/logger/diaryComment/reply',
                        type: 'post',
                        data: this.replyData,
                        requestBody: true,
                        success: (res)=>{
                            if(res && res.code === 0) {
                                this.commentListData = [];
                                this.pageNo = 1;
                                this.loadCommentData();
                                this.value = "";
                                this.$emit('handleReplyNum', true);
                            } else {
                                this.$Message.error((res && res.msg) || '网络错误');
                            }
                        },
                        error: (res)=>{
                            this.$Message.error((res && res.msg) || '网络错误');
                        }
                    })
                }, 200);
            },
            handleLoadMore() { // 加载更多
                this.pageNo++;
            },
            handleReload() { // 网络错误，重新加载
                this.loadError = false; 
                this.loadCommentData();
            },
            deleteSingleComment(commentItem) { // 删除某条评论(仅自己)
                let commentItemId = commentItem.id;
                this.$Modal.confirm({
                    title: '删除回复提示',
                    content: '点击确定删除该回复',
                    onOk: () =>{
                        this.$ajax({
                            url: "/logger/diaryComment/delete/" + commentItemId,
                            type: 'delete',
                            success: (res)=>{
                                if(res && res.code === 0) {
                                    let index;
                                    this.commentListData.forEach((item, key) => {
                                        if(item.id === commentItemId) {
                                            index = key;
                                        }
                                    });
                                    this.commentListData.splice(index, 1);
                                    this.$emit('handleReplyNum');
                                } else {
                                    this.$Message.error((res && res.msg) || '网络错误');
                                }
                            },
                            error: (res)=>{
                                this.$Message.error((res && res.msg) || '网络错误');
                            }
                        })
                    }
                })
            }
        },
        watch: {
            "pageNo": "loadCommentData"
        },
        created() {
            this.loadCommentData();
        },
        mounted() {
            this.$refs.replyWrapper && this.$refs.replyWrapper.focus();
            document.onclick = () => {
                this.showFace = false;
            }
        }
    }
</script>
<style lang="less">
    .reply-wrapper {
        .comment-list {
            .reply-text {
                i {
                    display: inline-block;
                    background-repeat: no-repeat;
                    background-position: center;
                    vertical-align: top;
                    height: 20px;
                    width: 20px;
                    background-size: 16px 16px;
                }
            }
        }
    }
</style>

<style lang="less" scoped>
    @import '../../../assets/css/var.less';
    .reply-wrapper {
        &.fade-enter {
            transition: .2s ease opacity;
            opacity: 0;
        }
        &.fade-enter-in {
            opacity: 1;
        }
        background-color: @white-color;
        font-size: 14px;        
        color: @gray-color-normal;     
        .input {
            position: relative;
            height: 60px;
            font-size: 0;
            textarea{
                width: 100%;
                height: 60px;
                padding: 10px;
                font-size: 14px;
                line-height: 18px;
                border-color: @border-color;
                border-bottom: 0;
                outline: 0px;
                word-wrap: break-word;
                word-break: break-all;
                color: @gray-color-dark;
                resize: none;
            }
            .input-number {
                position: absolute;
                font-size: 14px;
                color: @gray-color-light;
                bottom: 5px;
                right: 20px;
                & > .exceed {
                    color: @error-color;
                }
            }
        }
        .comment-btn {
            position: relative;
            width: 100%;
            padding: 13px;
            border: 1px solid @border-color;
            border-top: 0;
            background-color: #f5f5f5;
            .face-btn,
            .file-btn {
                font-size: 20px;
                vertical-align: middle;
                cursor: pointer;
            }
            .face-btn {
                margin: 0 14px;
            }
            .ok-btn {
                float: right;
                padding-top: 3px;
                padding-bottom: 3px;
                width: 56px;
            }
            .emoji {
                position: absolute;
                top: 40px;
                left: 10px;
                z-index: 99;
            }
        }

        .comment-list {
            font-size: 14px;
            .comment-item {
                padding: 20px 0 0 0;
                border-bottom: 1px solid @border-color;
                &.fade-list-leave-active {
                    transition: opacity 0.6s;
                }
                &.fade-list-leave, &.fade-list-leave-to {
                    opacity: 0;
                }
                .avatar-wrapper {
                    float: left;
                }
                .comment-content {
                    margin-left: 50px;
                    .names {
                        line-height: 14px;
                        margin-bottom: 6px;
                        .username {
                            color: #262626;
                        }
                        .text {
                            color: #9e9e9e;
                        }
                        .reply-username {
                            color: @text-color;
                        }
                    }
                }
                .content {
                    .reply-text {
                        margin-bottom: 6px;
                        color: #666;
                        line-height: 22px;
                        word-wrap: break-word;
                        word-break: break-all;
                    }
                    .reply-attach-list {
                        // .audio-wrapper {
                        //     width: 22%;
                        // }
                        .video-wrapper {
                            width: 520px;
                            overflow: hidden;
                        }
                        .image-wrapper {
                            width: 380px;
                            overflow: hidden;
                        }
                    }
                }
                .operate {
                    margin-bottom: 10px;
                    font-size: 12px;
                    color: @gray-color-light;
                    .reply, .del {
                        float: right;
                        cursor: pointer;
                    }
                }
            }
        }
    }
</style>
