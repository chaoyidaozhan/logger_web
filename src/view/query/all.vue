<template>
    <fs-frame>
        <template slot="head">
            <fs-query-form 
                :showMember="true"
                :showTemplate="true"
                :showDatePicker="showDatePicker"
                @handleQuery="handleQuery" ref="queryForm"/>
        </template>
        <template slot="body" >
            <fs-query-list :range="range" :params="params" :showDatePicker="showDatePicker"/>
        </template>
    </fs-frame>
</template>
<script>
    import query from 'app_src/mixins/query'
    export default {
        data() {
            return {
                range: '0',
                showDatePicker: true
            }
        },
        mixins: [query]
    }
</script>
