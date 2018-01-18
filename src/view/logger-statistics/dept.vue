<template>
    <fs-frame>
        <template slot="head">
            <fs-query-form 
                :showTemplate="true"
                :showDept="true"
                :showOrderType="true"
                deptApiUri="/logger/team/getAuthDepts"
                @handleQuery="handleQuery" ref="queryForm"/>
        </template>
        <template slot="body">
            <fs-logger-statistics 
                :params="params"
                type="dept"
                title="部门名称"
                ref="loggerStatistics"/>
        </template>
    </fs-frame>
</template>
<script>
import statistics from 'app_src/mixins/statistics';
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