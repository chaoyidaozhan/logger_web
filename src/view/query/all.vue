<template>
    <fs-frame>
        <template slot="head">
            <fs-query-form 
                :showMember="true"
                :showTemplate="true"
                :showDatePicker="showDatePicker"
                :createDate="createDate"
                @handleQuery="handleQuery" ref="queryForm"/>
        </template>
        <template slot="body" >
            <fs-query-list :range="range" :params="params" :initCreateDate="initCreateDate" :showDatePicker="showDatePicker"/>
        </template>
    </fs-frame>
</template>
<script>
    import query from 'app_src/mixins/query'
    export default {
        data() {
            return {
                range: '0',
                showDatePicker: true,
                createDate: []
            }
        },
        mixins: [query],
        methods: {
            initCreateDate(createDate) {
                this.createDate = createDate;
            }
        }
    }
</script>
