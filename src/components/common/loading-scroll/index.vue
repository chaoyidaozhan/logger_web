<template>
    <div class="loading-wrapper">
        <div class="loading-item" v-if="loading && !loadError && hasMore">
            <Spin>
                <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                <span class="load-text">正在加载中...</span>
            </Spin>
        </div>
        <div class="error-item" v-if="loadError && hasMore && !loading">
            <span class="error-text">网络异常,</span>
            <span class="error-reload" @click="handleReload"> 点击重新加载</span>
        </div>
        <div class="more-item" v-if="!hasMore && !loadError && !loading">
            <p>已加载全部数据</p>
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
        loadError: {
            type: Boolean,
            default: false
        },
        hasMore: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        handleReload() {
            this.$emit("handleReload");
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
    }
</style>


