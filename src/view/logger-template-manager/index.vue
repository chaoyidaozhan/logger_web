<template>
    <fs-frame>
        <template slot="head">
            <div class="logger-detail-header clearfix">
                日志模板
            </div>
        </template>
        <template slot="body">
            <!-- <router-view></router-view> -->
            <fs-template-list :showEdit="true"/>
        </template>
    </fs-frame>
</template>
<script>
import FsFrame from '../frame/';
import FsTemplateList from 'app_component/logger-template-list/';
export default {
    components: {
        FsFrame,
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
            background-color: @gray-color-normal;
            line-height: 19px;
            text-align: center;
            margin-right: 8px;
        }
    }
}
</style>


