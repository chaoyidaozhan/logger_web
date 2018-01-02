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
                <i class="face-btn" 
                   @click="chooseFace">表情</i>
                <i class="file-btn">文件</i>
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

            <div class="comment-list">
                <div class="comment-item"
                     v-for="(commentItem, key) in commentListData" 
                     :key="key">
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

                        <p class="content" v-html="commentItem.content"></p>

                        <p class="operate">
                            <span>{{commentItem.createTime}}</span>
                            <span class="reply"
                                  v-show="!commentItem.isMyself">回复</span>
                            <span class="del"
                                  v-show="commentItem.isMyself"
                                  @click="deleteSingleComment(commentItem)">删除</span>
                        </p>
                    </div>
                </div>
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
            loading
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
                pageNum: 1,
                pageSize: 10,
                commentListData: [],
                loading: true,
                loadError: false,
                hasMore: true,
                loadMore: false,
                timer: null
            }
        },
        computed: {

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
            handleFace(faceItem) { // 表情点击
                this.value += "[" + faceItem + "]";             
                let inputContent = this.value.trim();
                if(inputContent.length >= this.maxLength) {
                    this.value = inputContent.substring(0, this.maxLength);
                }
                this.$refs.replyWrapper.focus();
            },
            filterContent(content) {
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
            updateList(commentData) {
                commentData.forEach((item) => {
                    item.createTime = formatTime(item.createTime);
                    item.isMyself = item.memberId === +this.$store.state.userInfo.member_id;
                    item.content = this.filterContent(item.content);
                });
                this.pageNum === 1
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
                clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    this.$ajax({
                        url: `/logger/diaryComment/${this.dailyId}/reply`,
                        type: 'get',
                        data: {
                            pageNum: this.pageNum,
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
                this.$ajax({
                    url: '/logger/diaryComment/reply',
                    type: 'post',
                    data: {
                        diaryId: this.dailyId,
                        replySource: 3,
                        content: this.value.replace(/^回复[^:]+?:/, ""),
                        fileStr: []
                        // replyCommentId: 3216,
                        // replyUserName: "赵子龙"
                    },
                    success: (res)=>{
                        if(res && res.code === 0) {
                            this.commentListData = [];
                            this.pageNum = 1;
                            this.loadCommentData();
                            this.value = "";
                        } else {
                            this.$Message.error((res && res.msg) || '网络错误');
                        }
                    },
                    error: (res)=>{
                        this.$Message.error((res && res.msg) || '网络错误');
                    }
                })
            },
            handleLoadMore() { // 加载更多
                this.pageNum++;
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
            "pageNum": "loadCommentData"
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
            .content {
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
                border-color: @gray-color-elip;
                outline: 0px;
                word-wrap: break-word;
                word-break: break-all;
                color: #333;
                resize: none;
            }
            .input-number {
                position: absolute;
                font-size: 14px;
                bottom: 10px;
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
            background-color: #f5f5f5;
            .face-btn {
                margin: 0 14px;
                cursor: pointer;
            }
            .file-btn {
                cursor: pointer;
            }
            .ok-btn {
                float: right;
                padding-top: 3px;
                padding-bottom: 3px;
                width: 56px;
                height: 25px;
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
                padding: 20px 20px 0;
                border-bottom: 1px solid #eee;
                .avatar-wrapper {
                    float: left;
                }
                .comment-content {
                    margin-left: 50px;
                }
                .text {
                    color: #9e9e9e;
                }
                .username {
                    color: #262626;
                }
                .reply-username {
                    color: @text-color;
                }
                .content {
                    margin-bottom: 5px;
                    color: #666;
                    line-height: 22px;
                    word-wrap: break-word;
                    word-break: break-all;
                }
                .operate {
                    margin-bottom: 10px;
                    font-size: 12px;
                    color: @gray-color-light;
                }
                .reply,
                .del {
                    float: right;
                    cursor: pointer;
                }
            }
        }
    }
</style>
