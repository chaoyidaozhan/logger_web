<template>
    <div class="empty-tips" :class="`empty-${position}`">
        <div class="empty" v-if="!showError">
            <img v-if="!iconType" :src="imgSrc" class="empty-img">
            <i v-else class="icon-no-data"></i>
            <p class="empty-msg">{{emptyMsg}}</p>
        </div>
        <div class="error" v-if="showError">
            <span class="error-msg">{{errorMsg}}</span>,
            <span class="reload" @click="handleReload">{{$t('status.clickToReload')}}</span>
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
            default: require("./../../../assets/images/no-data-search.png")
        },
        emptyMsg: {
            type: String,
            default: function() {
                return this.$t('status.noRelevantData')
            }
        },
        errorMsg: {
            type: String,
            default: function() {
                return this.$t('status.networkError')
            }
        },
        position: {
            type: String,
            default: 'middle'
        }
    },
    methods: {
        handleReload() {
            this.$emit('handleReload')
        }
    }
}
</script>
<style lang="less" scoped>
@import '../../../assets/css/var.less';
    .empty-tips {
        position: relative;
        width: 100%;
        margin: 0 auto;
        font-size: 14px;
        text-align: center;
        .empty-img, .icon-no-data {
            width: 125px;
            height: 125px;
        }
        .icon-no-data {
            display: inline-block;
            background-repeat: no-repeat;
            background-position: center;
            background-image: url('../../../assets/images/no-data-member.png');
            background-size: contain;
        }
        &.empty-middle {
           margin-top: 10%;
        }
        .empty-msg {
            margin-top: 16px;
            color: #adadad;
            line-height: 20px;
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
            color: @gray-color-elip;
        }
    }
</style>


