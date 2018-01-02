<template>
    <div class="loading-wrapper">
        <div class="loading-item" v-if="loading && !loadError && hasMore">
            <Spin>
                <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                <span class="load-text">{{loadingMsg}}</span>
            </Spin>
        </div>
        <div class="error-item" v-if="loadError && hasMore && !loading">
            <span class="error-text">网络异常,</span>
            <span class="error-reload" @click="handleReload"> 点击重新加载</span>
        </div>
        <div class="loaded-all" v-if="!hasMore && !loadError && !loading">
            <p>已加载全部数据</p>
        </div>
        <div class="load-more" v-if="hasMore && !loadError && !loading && loadMore">
            <p @click="handleLoadMore">加载更多</p>
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
            default: "正在加载中..."
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
            this.$emit("handleReload");
        },
        handleLoadMore() {
            this.$emit("handleLoadMore");
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
        font-size: 14px;
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


