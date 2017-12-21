<template>
    <div class="empty-tips">
        <div class="empty" v-if="!showError">
            <img v-if="!iconType" :src="imgSrc" class="empty-img">
            <template>
                <i class="icon-none-department" v-if="iconType == depart"></i>
                <i class="icon-none-team" v-if="iconType == team"></i>
                <i class="icon-none-user" v-if="iconType == user"></i>
            </template>
            <p class="empty-msg">{{emptyMsg}}</p>
        </div>
        <div class="error" v-if="showError">
            <span class="error-msg">{{errorMsg}}</span>
            <span class="reload" @click="handleReload">, 点击重新加载</span>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        iconType: {
            type: String
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
        handleReload(params) {
            this.$emit('handleReload', params);
        }
    }
}
</script>
<style lang="less" scoped>
    .empty-tips {
        position: relative;
        width: 200px;
        margin: 0 auto;
        text-align: center;
        top: 30%;
        margin-top: -100px;
        .empty-msg {
            margin-top: 16px;
            color: #999;
        }
        .error-msg {
            color: #666;
        }
        .reload {
            color: #000;
            cursor: pointer;
        }
    }
</style>


