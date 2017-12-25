<template>
    <fs-frame>
        <template slot="head">
            <fs-query-form 
                :showTemplate="true"
                :showDepart="true"
                :showOrderType="true"
                @handleQuery="handleQuery" ref="queryForm"/>
        </template>
        <template slot="body">
            <fs-logger-statistics 
                :params="params"
                type="depart"
                ref="loggerStatistics"/>
        </template>
    </fs-frame>
</template>
<script>
import FsFrame from '../frame/';
import FsQueryForm from 'app_component/common/query-form/'
import FsLoggerStatistics from 'app_component/logger-statistics/'
export default {
    data() {
        return {
            params: {
                deptId: 0,
                orderType: '1'
            }       
        }
    },
    components: {
        FsFrame,
        FsQueryForm,
        FsLoggerStatistics
    },
    methods: {
        handleQuery(params) {
            this.params = params;
            this.$refs.loggerStatistics.loadData();
        }
    }
}
</script>
