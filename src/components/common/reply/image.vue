<template>
    <div class="img-list">
        <div class="img-item" 
            v-for="item in images" :key="item.fid">
            <img :src="item.fileUrl" :alt="item.fileName">
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
