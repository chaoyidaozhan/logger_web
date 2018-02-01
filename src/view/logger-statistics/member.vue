<template>
    <fs-frame>
        <template slot="head">
            <fs-query-form 
                :showTemplate="true"
                :showMember="true"
                :showOrderTypeMulti="true"
                :showExportExcel="true"
                :showGroupExcelBtn="false"
                :showDeptExcelBtn="false"
                @handleQuery="handleQuery" ref="queryForm"/>
        </template>
        <template slot="body">
            <fs-member-statistics 
                :params="params"
                type="member"
                title="人员名称"
                :minDate="minDate"
                :maxDate="maxDate"
                ref="LoggerLoggerStatistics"/>
        </template>
    </fs-frame>
</template>
<script>
import statistics from 'app_src/mixins/statistics';
export default {
    data() {
        return {
            params: {
                orderType: '4'
            },
            validateString: 'memberIds',
        }
    },
    mixins: [statistics]
}
</script>