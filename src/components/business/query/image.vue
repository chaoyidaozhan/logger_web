<template>
    <div class="img-list">
        <div class="img-item" 
            v-for="(item, index) in images"
            :key="item.index">
            <img ref="previewImg" 
                :key="index"
                class="preview-img" 
                :src="item.fileUrl || item.fileKey" 
                :alt="item.fileName" 
                preview="query"
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
            margin: 0 10px 10px 0;
            cursor: pointer;
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
</style>
