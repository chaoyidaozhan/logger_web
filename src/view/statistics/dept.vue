<template>
    <fs-frame>
        <template slot="head">
           <fs-query-form 
                v-if="type == 'dept'"
                :showReportRule="true"
                :showTemplate="true"
                :showDept="true"
                :showOrderType="true"
                :showOrderTypeMulti="type"
                :showExportExcel="true"
                :showCreateMenu="false"
                deptApiUri="/team/v2/getAuthDepts"
                adapt1440p
                @handleQuery="handleQuery" 
                ref="queryForm"/>
            <fs-query-form 
                v-else-if="type == 'group'"
                :showReportRule="true"
                :showTemplate="true"
                :showGroup="true"
                :showOrderType="true"
                :showOrderTypeMulti="type"
                :showExportExcel="true"
                :showGroupExcelBtn="true"
                :showDeptExcelBtn="false"
                :showCreateMenu="false"
                adapt1440p
                groupApiUri="/group/authMe"
                @handleQuery="handleQuery" 
                ref="queryForm"/>
            <fs-query-form 
                v-else-if="type == 'member'"
                :showReportRule="true"
                :showTemplate="true"
                :showMember="true"
                :showOrderTypeMulti="type"
                :showExportExcel="true"
                :showGroupExcelBtn="false"
                :showDeptExcelBtn="false"
                :showCreateMenu="false"
                adapt1440p
                @handleQuery="handleQuery" 
                ref="queryForm"/>
        </template>
        <template slot="body">
            <fs-common-statistics 
                :params="params"
                :type="type"
                :title="title"
                v-if="type == 'dept' || type == 'group'"/>
            <fs-member-statistics 
                :params="params"
                :type="type"
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
            type: 'dept',
            groupApiUri: '/team/v2/getAuthDepts'
        }
    },
    mixins: [statistics]
}
</script>
