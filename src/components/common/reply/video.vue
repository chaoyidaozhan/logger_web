<template>
    <div class="video-list">
        <div class="video-item"
            v-for="item in videos" :key="item.fid">
            <video controls="true" :src="item.fileUrl">您的浏览器不支持html5的video标签</video>
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
            & > video {
                width: 100%;
                height: 100%;
            }
        }
    }
</style>
