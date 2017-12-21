<template>
    <div class="empty-tips">
        <div class="empty" v-if="showEmpty">
            <img :src="imgSrc" class="empty-img">
            <p class="emptyMsg">{{ emptyMsg }}</p>
        </div>
        <div class="error" v-if="showError">
            <span class="errorMsg">{{ errorMsg }}</span>
            <span class="reload" @click="reload">, 点击重新加载</span>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        showEmpty: {
            type: Boolean,
            default: false
        },
        showError: {
            type: Boolean,
            default: false
        },
        imgSrc: {
            type: String,
            default: require("./../../../assets/images/nodata.png")
        },
        emptyMsg: {
            type: String,
            default: "没有相关数据"
        },
        errorMsg: {
            type: String,
            default: "网络异常"
        }
    },
    methods: {
        reload(params) {
            this.$emit('reload', params);
        }
    }
}
</script>
<style lang="less" scoped>
    .empty-tips {
        position: relative;
        width: 100%;
        height: 100%;
        text-align: center;
        font-size: 14px;
        line-height: 20px;
        .empty {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        .emptyMsg {
            margin-top: 16px;
            color: #999;
        }
        .errorMsg {
            color: #666;
        }
        .reload {
            color: #000;
            cursor: pointer;
        }
    }
</style>


