<template>
    <fs-frame>
        <template slot="head">
            <fs-query-form 
                :showTemplate="true"
                :showGroup="true"
                :showOrderType="true"
                @handleQuery="handleQuery" ref="queryForm"/>
        </template>
        <template slot="body">
            <fs-logger-statistics 
                :params="params"
                type="group"
                title="团队名称"
                ref="LoggerLoggerStatistics"/>
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
                groupId: 0,
                orderType: '0'
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
        }
    }
}
</script>
