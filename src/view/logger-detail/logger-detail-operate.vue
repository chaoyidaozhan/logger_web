<template>
    <div class="logger-detail">
        <div class="title"><span>2</span>创建日志-产品周报</div>
        <!-- <fs-template-list/> -->
    </div>
</template>
<script>
import FsTemplateList from 'app_component/logger-template-list/';
export default {
    components: {
        FsTemplateList
    }
}
</script>
<style lang="less" scoped>
@import '../../assets/css/var.less';
.logger-detail {
    height: 100%;
    overflow: auto;
    padding: 0 10px 10px;
    .title {
        height: 60px;
        line-height: 60px;
        padding-left: 10px;
        color: @gray-color-medium;
        font-size: 14px;
        span {
            display: inline-block;
            vertical-align: middle;
            width: 20px;
            height: 20px;
            border-radius: 100%;
            background-color: @gray-color-elip;
            line-height: 19px;
            text-align: center;
            margin-right: 8px;
        }
    }
}
</style>


