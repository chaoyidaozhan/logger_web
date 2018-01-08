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
                background-color: #000;
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
                border: 2px solid #fff;
                text-align: center;
                padding: 0;
                opacity: 1;
                background-color: rgba(43, 51, 63, .7);
                transition: all .4s;
                i {
                    color: #fff;
                }
            }
            &:hover {
                .play-btn {
                    background-color: #2b333f;
                }
            }
        }
    }
</style>
