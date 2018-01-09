<template>
    <div class="video-list">
        <div class="video-item"
            v-for="item in videos" :key="item.fid">
            <div @click="open(item)">
                <span class="play-btn cursor-pointer"><Icon type="play"></Icon></span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        videos: {
            type: Array,
            default: []
        }
    },
    methods: {
        open(params) {
            this.$videoPreview.open(params.fileUrl, params.fileName);
        }
    }
}
</script>

<style lang="less" scoped>
@import '../../../assets/css/var.less';
    .video-list {
        .video-item {
            float: left;
            width: 250px;
            height: 158px;
            margin-right: 5px;
            margin-bottom: 5px;
            & > div {
                width: 100%;
                height: 100%;
                background-color: @gray-color-light;;
                position: relative;
            }
            .play-btn {
                position: absolute;
                left: 50%;
                top: 50%;
                margin: -25px 0 0 -25px;
                display: inline-block;
                font-size: 24px;
                line-height: 46px;
                width: 50px;
                border-radius: 50%;
                border: 2px solid @white-color;
                text-align: center;
                padding: 0;
                opacity: 1;
                transition: all .4s;
                i {
                    color: @white-color;
                }
            }
            &:hover {
                .play-btn {
                    transform: scale(1.1)
                }
            }
        }
    }
</style>
