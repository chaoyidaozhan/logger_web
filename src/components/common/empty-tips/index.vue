<template>
    <div class="empty-tips" :class="`empty-${position}`">
        <div class="empty" v-if="!showError">
            <img v-if="!iconType" :src="imgSrc" class="empty-img">
            <template v-else>
                <i class="icon-none-department" v-if="iconType == 'depart'"></i>
                <i class="icon-none-team" v-if="iconType == 'team'"></i>
                <i class="icon-none-user" v-if="iconType == 'member'"></i>
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
        },
        position: {
            type: String,
            default: 'middle'
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
@import '../../../assets/css/var.less';
    .empty-tips {
        position: relative;
        width: 200px;
        margin: 0 auto;
        text-align: center;
        &.empty-middle {
            top: 30%;
            margin-top: -100px;
        }
        &.empty-nomal {
            top: 0;
            margin-top: 0;
        }
        .empty-msg {
            margin-top: 16px;
            color: @gray-color-light;
        }
        .error-msg {
            color: @gray-color-medium;
        }
        .reload {
            color: @primary-color;
            cursor: pointer;
        }
        [class^="icon-"] {
            font-size: 75px;
            color: @gray-color-normal;
        }
    }
</style>


