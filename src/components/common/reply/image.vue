<template>
    <div class="img-list">
        <div class="img-item" 
            v-for="(item, index) in images" :key="item.fid">
            <img ref="previewImg" 
                :key="index"
                class="preview-img" 
                :src="item.fileKey" 
                :alt="item.fileName" 
                preview="reply"
                :preview-text="item.fileName"
            >
        </div>
    </div>
</template>

<script>
export default {
    props: {
        images: {
            type: Array,
            default: []
        }
    }
}
</script>
<style lang="less" scoped>
    .img-list {
        display: inline-block;
        max-width: 370px;
        margin-top: 5px;
        .img-item {
            float: left;
            height: 110px;
            width: 110px;
            margin-right: 10px;
            margin-bottom: 10px;
            cursor: pointer;
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
</style>
