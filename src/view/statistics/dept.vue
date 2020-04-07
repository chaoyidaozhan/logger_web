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
                type="dept"
                :title="`${$t('noun.personnel')}${$t('noun.name')}`"
            />
        </template>
    </fs-frame>
</template>
<script>
import statistics from 'app_src/mixins/statistics'
export default {
    data() {
        return {
            deptId: 0,
            validateString: 'deptId'
        }
    },
    mixins: [statistics]
}
</script>
