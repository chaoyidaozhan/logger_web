<template>
    <fs-frame>
        <template slot="head">
            <fs-query-form 
                :showTemplate="true"
                :showDept="true"
                :showOrderType="true"
                showOrderTypeMulti="dept"
                :showExportExcel="true"
                :showReportRule="true"
                deptApiUri="/team/v2/getAuthDepts"
                @handleQuery="handleQuery" ref="queryForm"/>
        </template>
        <template slot="body">
            <fs-common-statistics 
                :params="params"
                :type="type"
                :title="title"
                :minDate="minDate"
                :maxDate="maxDate"
                v-if="type == 'dept' || type == 'group'"/>
            <fs-member-statistics 
                :params="params"
                type="member"
                :title="title"
                :minDate="minDate"
                :maxDate="maxDate"
                ref="LoggerLoggerStatistics"
                v-if="type == 'member'"/>
        </template>
    </fs-frame>
</template>
<script>
import statistics from 'app_src/mixins/statistics'
export default {
    data() {
        return {
            deptId: 0,
            validateString: 'deptId',
            type: 'dept'
        }
    },
    mixins: [statistics]
}
</script>
