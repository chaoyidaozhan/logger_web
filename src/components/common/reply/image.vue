<template>
    <div class="img-list">
        <div class="img-item" 
            v-for="(item, index) in images" :key="item.fid">
            <img ref="previewImg" 
                class="preview-img" 
                :src="item.fileUrl" 
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
                showAnimationDuration: 200,
                fullscreenEl: false
            },
            loadTimer: null
        }
    },
    methods: {
        setList() { // 设置list
            this.list = [];
            this.$nextTick(()=>{
                let images = this.$refs.previewImg;
                console.log(images);
                images && images.forEach((item, index) => {
                    let w = item.naturalWidth && item.naturalWidth || 600,
                        h = item.naturalHeight && item.naturalHeight || 400,
                        imagesList = this.images[index];
                        (w < 100 && h < 100) && (w = w * 10, h = h * 10);
                        this.list.push({
                            src: imagesList.fileUrl,
                            w: w,
                            h: h,
                        });
                        let pswpBtns = document.querySelectorAll('.pswp__button');
                        if(pswpBtns && pswpBtns.length) {
                            pswpBtns.forEach(e => {
                                switch (e.title) {
                                    case 'Zoom in/out':
                                        e.title = '放大/缩小'
                                        break;
                                    case 'Close (Esc)':
                                        e.title = '关闭 （ESC）'
                                        break;
                                    case 'Previous (arrow left)':
                                        e.title = '上一张'
                                        break;
                                    case 'Next (arrow right)':
                                        e.title = '下一张'
                                        break;
                                    default:
                                        break;
                                }
                            });
                        }
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
