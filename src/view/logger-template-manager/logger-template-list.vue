<template>
    <fs-frame>
        <template slot="head">
            <div class="logger-detail-header clearfix">
                <span>日志模板</span>
                <div class="pull-right">

                </div>
            </div>
        </template>
        <template slot="body">
            <div class="logger-template-list">
                <fs-template-list :showEdit="true"/>
            </div>
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
    },
}
</script>
<style lang="less" scoped>
.logger-template-list {
    width: 100%;
    max-height: 100%;
    overflow: auto;
    padding: 20px 10px 60px;
}
</style>
