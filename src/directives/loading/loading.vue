<template>
    <Spin :fix="fix" class="loading-wrapper">
        <Icon type="load-c" :size='size' class="loading"></Icon>
        <div class="text">{{text}}</div>
    </Spin>
</template>
<script>
export default {
    data() {
        return {
            fix: true, // 默认相对父级定位
            text: 'loading',  // 默认文字
            size: '18',
        }
    }
}
</script>
<style lang="less" scoped>
@import '../../assets/css/var.less';
.loading-wrapper {
    z-index: 9999;
    color: @primary-color;
    background-color: rgba(255,255,255,.6);
    .text {
        font-size: 12px;
    }
}
.loading {
    animation: ani-demo-spin 1s linear infinite;
    margin-bottom: 10px;
}
@keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
}
</style>


