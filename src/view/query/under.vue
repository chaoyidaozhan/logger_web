<template>
    <fs-frame>
        <template slot="head">
            <fs-query-form 
                :showTemplate="true"
                :showDatePicker="true"
                :showDept="true"
                :showOtherDept="true"
                deptApiUri="/team/getDeptsWithPart"
                @handleQuery="handleQuery" ref="queryForm"/>
        </template>
        <template slot="body" >
            <fs-query-list :range="range" :params="params"/>
        </template>
    </fs-frame>
</template>
<script>
import query from 'app_src/mixins/query';
export default {
    data() {
        return {
            range: '1'
        }
    },
    mixins: [query]
}
</script>
