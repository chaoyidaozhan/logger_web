<template>
    <fs-frame>
        <template slot="head">
            <fs-query-form 
                :showTemplate="true"
                :showMember="true"
                :showOrderType="true"
                @handleQuery="handleQuery" ref="queryForm"/>
        </template>
        <template slot="body">
            <fs-logger-statistics 
                :params="params"
                type="member"
                title="人员名称"
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
                memberIds: 0,
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
