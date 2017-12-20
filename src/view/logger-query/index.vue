<template>
    <fs-frame>
        <template slot="head">
            <!-- <span class="title">日志查询</span>  -->
            <fs-query-form @handleQuery="handleQuery"/>
        </template>
        <template slot="body">
            <fs-logger-list :params="params" ref="loggerList"/>
        </template>
    </fs-frame>
</template>
<script>
import FsFrame from '../frame/';
import FsQueryForm from 'app_component/common/query-form/'
import FsLoggerList from 'app_component/common/logger-list/';
export default {
    data() {
        return {
            params: {}
        }
    },
    components: {
        FsFrame,
        FsLoggerList,
        FsQueryForm
    },
    methods: {
        handleQuery(params) {
            this.params = params;
            this.$refs.loggerList.loadData();
        }
    }
}
</script>
