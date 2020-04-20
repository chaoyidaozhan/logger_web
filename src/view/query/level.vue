<template>
    <fs-frame>
        <template slot="head">
            <fs-query-form 
                :showTemplate="true"
                :showDatePicker="showDatePicker"
                :showDept="true"
                :showOtherDept="true"
                deptApiUri="/team/getDeptsWithPart"
                @handleQuery="handleQuery" 
                ref="queryForm"
                :showCreateMenu="true"
                :showBrowse="true"
                :createDate="createDate"/>
        </template>
        <template slot="body" >
            <fs-query-list 
                url="/diaryQuery/getSubordinateDiary"
                :isLowerLevel="true"
                :range="range" 
                :params="params" 
                :initCreateDate="initCreateDate" 
                :showDatePicker="showDatePicker"
            />
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
