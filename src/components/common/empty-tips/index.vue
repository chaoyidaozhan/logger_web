<template>
    <div class="empty-tips" :class="`empty-${position}`">
        <div class="empty" v-if="!showError">
            <img v-if="!iconType" :src="imgSrc" class="empty-img">
            <template v-else>
                <i class="icon-none-department" v-if="iconType == 'dept'"></i>
                <i class="icon-none-team" v-if="iconType == 'group'"></i>
                <i class="icon-none-user" v-if="iconType == 'member'"></i>
                <i class="icon-draft" v-if="iconType == 'template'"></i>
            </template>
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
            default: require("./../../../assets/images/nodata.png")
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
        width: 200px;
        margin: 0 auto;
        font-size: 14px;
        text-align: center;
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


