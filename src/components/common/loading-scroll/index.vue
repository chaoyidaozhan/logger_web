<template>
    <div class="loading-wrapper">
        <div class="loading-item" v-if="loading && !loadError">
            <Spin>
                <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                <span class="load-text">{{loadingMsg}}</span>
            </Spin>
        </div>
        <div class="error-item" v-if="loadError && !loading">
            <span class="error-text">{{$t('status.networkError')}},</span>
            <span class="error-reload" @click="handleReload">{{$t('status.clickToReload')}}</span>
        </div>
        <div class="loaded-all" v-if="!hasMore && !loadError && !loading">
            <p>{{$t('status.loadedAllData')}}</p>
        </div>
        <div class="load-more" v-if="hasMore && !loadError && !loading && loadMore">
            <p @click="handleLoadMore">{{$t('status.loadMore')}}</p>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        loading: {
            type: Boolean,
            default: true
        },
        loadingMsg: {
            type: String,
            default: function() {
                return this.$t('status.loading')
            }
        },
        loadError: {
            type: Boolean,
            default: false
        },
        hasMore: {
            type: Boolean,
            default: true
        },
        loadMore: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        handleReload() {
            this.$emit("handleReload")
        },
        handleLoadMore() {
            this.$emit("handleLoadMore")
        }
    }
}
</script>
<style lang="less" scoped>
    @import "../../../assets/css/var.less";
    .loading-wrapper {
        width: 100%;
        height: 60px;
        line-height: 60px;
        text-align: center;
        color: @gray-color-light;        
        font-size: 12px;
        position: relative;
        overflow: hidden;
        & > div {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
        }
        .demo-spin-icon-load{
            animation: ani-demo-spin 1s linear infinite;
            color: @gray-color-light;
            vertical-align: middle;       
        }
        @keyframes ani-demo-spin {
            from { transform: rotate(0deg);}
            50%  { transform: rotate(180deg);}
            to   { transform: rotate(360deg);}
        }
        .load-text {
           color: @gray-color-light;
           vertical-align: middle; 
        }
        .error-item {
            .error-reload {
                color: @primary-color;
                cursor: pointer;
            }
        }
        .load-more {
            cursor: pointer;
        }
    }
</style>


