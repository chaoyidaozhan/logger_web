<template>
    <fs-frame>
        <template slot="head">
            <!-- <span class="title">日志查询</span>  -->
            <fs-query-form @handleQuery="handleQuery" ref="queryForm"/>
        </template>
        <template slot="body">
            <fs-logger-list :params="params" ref="loggerList"/>
        </template>
    </fs-frame>
</template>
<script>
import FsFrame from '../frame/';
import FsQueryForm from 'app_component/common/query-form/'
import FsLoggerList from 'app_component/logger-list/';
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
    watch: {
        '$route': function (to, from) { // 切换初始化列表
            this.params = {};
            this.$refs.queryForm.resetQuery();
            this.$refs.loggerList.initList();
        }                                                    
    },
    methods: {
        handleQuery(params) {
            this.params = params;
        }
    }
}
</script>
