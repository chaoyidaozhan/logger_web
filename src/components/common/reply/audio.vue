<template>
    <div class="audio-list">
        <div class="audio-item" 
            v-for="item in audios" :key="item.fid">
            <audio :src="item.fileUrl" preload="auto">您的浏览器不支持html5的audio标签</audio>
            <span class="audio-icon"
                 :class="item.audioClass"
                 @click="playAudio(item, $event)">
            </span>
            <span class="audio-time">{{item.timeLength}} ''</span>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            audios: {
                type: Array,
                default: []
            }
        },
        methods: {
            playAudio(itemData, event) { // 播放音频           
                let audioDom =  event.target.previousElementSibling;
                audioDom.play();
                this.playAudioAnimate(itemData, "start");
                this.checkAudioState && window.clearInterval(this.checkAudioState);
                this.checkAudioState = window.setInterval(() => {
                    if (audioDom.ended) {
                        this.playAudioAnimate(itemData, "stop");
                    }
                }, 500);
            },
            playAudioAnimate(itemData, state) { // 音频播放动画
                if(state === "start") {
                    let count = 0;
                    this.playAudioFun && window.clearInterval(this.playAudioFun);
                    this.playAudioFun = window.setInterval(() => {
                        switch ((++count % 3)) {
                            case 1:
                                itemData.audioClass = 'audio1';
                                break;
                            case 2:
                                itemData.audioClass = 'audio2';
                                break;
                            case 0:
                                itemData.audioClass = 'audio3';
                                break;
                        }
                    }, 500);
                }else if(state === "stop") {
                    window.clearInterval(this.playAudioFun);
                    itemData.audioClass = 'audio3';
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    @attachUrl: "../../../assets/images/reply_attach/";
    .audio-list {
        font-size: 0;
        .audio-item {
            position: relative;
            width: 100%;
            padding: 7px 10px;
            margin-bottom: 6px;
            background-color: #f5f5f5;
            border-radius: 5px;
            &::before {
                position: absolute;
                top: 50%;
                left: -6px;
                margin-top: -6px;
                content: "";
                width: 0;
                height: 6px;
                border-top: 6px solid transparent;
                border-right: 6px solid #f5f5f5;
                border-bottom: 6px solid transparent;
            }
            .audio-icon {
                display: inline-block;
                width: 13px;
                height: 21px;
                cursor: pointer;
                vertical-align: top;
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                &.audio3 {
                    background-image: url("@{attachUrl}audio3.png")
                }
                &.audio2 {
                    background-image: url("@{attachUrl}audio2.png")
                }
                &.audio1 {
                    background-image: url("@{attachUrl}audio1.png")
                }
            }
            .audio-time {
                font-size: 14px;
                color: #9e9e9e;
                float: right;
            }
        }
    }
</style>
