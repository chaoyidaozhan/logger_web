<template>
    <fs-frame>
        <template slot="head">
            <fs-query-form 
                :showTemplate="true"
                :showGroup="true"
                :showOrderType="true"
                :showExportExcel="true"
                :showGroupExcelBtn="true"
                :showDeptExcelBtn="false"
                groupApiUri="/group/authMe"
                @handleQuery="handleQuery" ref="queryForm"/>
        </template>
        <template slot="body">
            <fs-logger-statistics 
                :params="params"
                type="group"
                title="内部群名称"
                ref="LoggerLoggerStatistics"/>
        </template>
    </fs-frame>
</template>
<script>
import statistics from 'app_src/mixins/statistics';
export default {
    data() {
        return {
            groupId: 0,
            validateString: 'groupId',
        }
    },
    mixins: [statistics]
}
</script>