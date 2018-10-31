<template>
    <fs-frame>
        <template slot="head">
            <fs-query-form 
                :showMember="true"
                :showTemplate="true"
                :showDatePicker="true"
                @handleQuery="handleQuery" ref="queryForm"/>
        </template>
        <template slot="body" >
            <fs-query-list :range="range" :params="params" />
        </template>
    </fs-frame>
</template>
<script>
import query from 'app_src/mixins/query'
export default {
    data() {
        return {
            range: '0'
        }
    },
    mixins: [query]
}
</script>
