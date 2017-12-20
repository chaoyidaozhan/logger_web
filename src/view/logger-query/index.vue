<template>
    <fs-frame>
        <template slot="head">
            <!-- <span class="title">日志查询</span>  -->
            <fs-query-form @handleQuery="handleQuery"/>
        </template>
        <template slot="body">
            <fs-logger-query-list ref="loggerQueryList"/>
        </template>
    </fs-frame>
</template>
<script>
import FsFrame from '../frame/';
import FsLoggerQueryList from 'app_component/logger-query/';
import FsQueryForm from 'app_component/common/query-form/'
export default {
    watch: {
        '$route': function (to, from) { // 路由权限控制
            // this.$refs.LoggerQueryList.initList()
        }
    },
    components: {
        FsFrame,
        FsLoggerQueryList,
        FsQueryForm
    },
    methods: {
        handleQuery(params) {
            this.$refs.loggerQueryList.loadData(params);
        }
    }
}
</script>
