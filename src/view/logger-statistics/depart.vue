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
                title="部门名称"
                ref="loggerStatistics"/>
        </template>
    </fs-frame>
</template>
<script>
import query from 'app_src/mixins/statistics';
export default {
    data() {
        return {
            deptId: 0,
            validateString: 'deptId'
        }
    },
    mixins: [query]
}
</script>