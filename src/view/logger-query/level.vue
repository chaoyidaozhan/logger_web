<template>
    <fs-frame>
        <template slot="head">
            <fs-query-form 
                :showTemplate="true"
                :showDatePicker="true"
                :showDept="true"
                deptApiUri="/team/getDeptsWithPart"
                @handleQuery="handleQuery" 
                ref="queryForm"/>
        </template>
        <template slot="body" >
            <fs-logger-list 
                url="/diaryQuery/getSubordinateDiary"
                :isLowerLevel="true"
                :range="range" 
                :params="params" 
                ref="loggerList"/>
        </template>
    </fs-frame>
</template>
<script>
import query from 'app_src/mixins/query';
export default {
    data() {
        return {
            range: '0'
        }
    },
    mixins: [query]
}
</script>
