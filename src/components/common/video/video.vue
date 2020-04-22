<template>
    <Modal
        class-name="logger-video-wrapper"
        @on-ok="controlVideo"
        @on-cancel="controlVideo"
        :title="title"
        :width="800"
        v-model="showModal">
        <div class="video-js">
            <video ref="video" controls="true">
                <source :src="src"> 
            </video>
        </div>
        <div class="footer" slot="footer"></div>
    </Modal>
</template>
<script>
import videojs from 'video.js';
// import SWF_PATH from 'video.js/dist/video-js.swf';
// videojs.options.flash.swf = SWF_PATH;

export default {
    data() {
        return {
            showModal: false,
            player: null,
            src: null,
            title: null
        }
    },
    methods: {
        controlVideo() {
            this.player.pause();
        },
        open(src, title) {
            this.showModal = true;
            this.src = src;
            this.title = title  || this.$t('operate.playVideo');
            if(this.player) {
                this.player.src(this.src);
                this.player.load(this.src);
                this.player.play();
            } else {
                this.$nextTick(()=>{
                    let video = this.$refs.video
                    if(video) {
                        this.player = videojs(video, {
                            controls: true,
                            preload: 'auto'
                        });
                    }
                    this.player.play();
                }) 
            }
        },
    }
}
</script>
<style lang="less">
.logger-video-wrapper {
    .ivu-modal-footer {
        display: none;
    }
    .ivu-modal-body {
        padding: 0;
    }
    .ivu-modal-header {
        padding: 12px 16px 12px;
    }
    .video-js {
        width: 100%;
        padding-bottom: 66%;
        overflow: hidden;
        button {
            &:focus {
                outline: none;
            }
        }
        .vjs-big-play-button {
            width: 90px;
            height: 45px;
            top: 50%;
            left: 50%;
            margin: -30px 0 0 -45px;
        }
        .vjs_video_3-dimensions {
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            position: absolute;
        }
    }
}
</style>
