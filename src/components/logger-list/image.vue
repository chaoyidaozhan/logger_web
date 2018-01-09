<template>
    <div class="img-list">
        <div class="img-item" 
            v-for="(item, index) in images"
            :key="item.index">
            <img ref="previewImg" 
                class="preview-img" 
                :src="item.fileKey" 
                :alt="item.fileName" 
                @load="onLoad"
                @click="$preview.open(index, list, options)">
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
        },
        data() {
            return {
                list: [],
                options: {
                    bgOpacity: .6,
                    closeOnScroll: false,
                    closeOnVerticalDrag: false,
                    shareEl: false,
                    barsSize: {top:0,bottom:0},
                    captionEl: false,
                    showAnimationDuration: 200
                },
                loadTimer: null
            }
        },
        methods: {
            setList() { // 设置list
                this.list = [];
                this.$nextTick(()=>{
                    let images = this.$refs.previewImg;                
                    images && images.forEach((item, index) => {
                        let w = item.naturalWidth && item.naturalWidth || 600,
                            h = item.naturalHeight && item.naturalHeight || 400,
                            imagesList = this.images[index];
                            (w < 100 && h < 100) && (w = w * 10, h = h * 10);
                            this.list.push({
                                src: imagesList.fileKey,
                                w: w,
                                h: h,
                            })
                    });
                })
            },
            onLoad(e) { // 加载成功
                clearTimeout(this.loadTimer);
                this.loadTimer = setTimeout(() => {
                    this.setList();
                }, 300);
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
            margin: 0 10px 10px 54px;
            cursor: pointer;
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
</style>