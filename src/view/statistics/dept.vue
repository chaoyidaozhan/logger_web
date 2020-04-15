<template>
    <fs-frame>
        <template slot="head">
            <fs-query-form 
                :showTemplate="true"
                :showDept="true"
                :showOrderType="true"
                :showOrderTypeMulti="type"
                :showExportExcel="true"
                :showReportRule="true"
                deptApiUri="/team/v2/getAuthDepts"
                groupApiUri="/group/authMe"
                @handleQuery="handleQuery" ref="queryForm"/>
        </template>
        <template slot="body">
            <fs-common-statistics 
                :params="params"
                :type="type"
                :title="title"
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
            type: 'dept',
            groupApiUri: '/team/v2/getAuthDepts'
        }
    },
    mixins: [statistics]
}
</script>
