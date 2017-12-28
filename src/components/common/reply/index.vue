<template>
    <div class="reply-wrapper">
        <div class="input">
            <textarea v-model="value" placeholder="发表您的评论" @keyup="handleKeyUp"></textarea>
            <p class="input-number">
                <span :class="{exceed: value.length >= 200}">{{value.trim().length}}</span>
                <span>/{{maxLength}}</span>
            </p>
        </div>
        <div class="comment-btn clearfix">
            <i class="face-btn" @click="chooseFace">表情</i>
            <i class="file-btn">文件</i>
            <Button class="ok-btn" type="primary" :disabled="!value.trim().length">
                回复
            </Button>
            <emoji v-show="showFace" @handleFace="handleFace" class="emoji"></emoji>            
        </div>
        <div class="comment-list">
            <div class="comment-item">
                <avatar></avatar>
            </div>
        </div>
    </div>
</template>

<script>
    import emoji from '../emoji/';
    import avatar from '../avatar/';
    export default {
        components: {
            emoji,
            avatar
        },
        data() {
            return {
                value: '',
                isFocus: true,
                maxLength: 200,
                showFace: false
            }
        },
        methods: {
            handleKeyUp() {
                let inputContent = this.value.trim();
                if(inputContent.length >= this.maxLength) {
                    this.value = inputContent.substring(0, this.maxLength);
                }
            },
            chooseFace() {
                this.showFace ? this.showFace = false: this.showFace = true;
            },
            handleFace(faceItem) {
                this.value += "[" + faceItem + "]";             
                let inputContent = this.value.trim();
                if(inputContent.length >= this.maxLength) {
                    this.value = inputContent.substring(0, this.maxLength);
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    @import '../../../assets/css/var.less';
    .reply-wrapper {
        background-color: @white-color;
        font-size: 14px;        
        color: @gray-color-normal;     
        .input {
            position: relative;
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
                color: @gray-color-normal;
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
    }
</style>
