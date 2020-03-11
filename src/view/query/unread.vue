<template>
    <fs-frame>
        <template slot="head">
            <fs-query-form 
                :showMember="true"
                :showTemplate="true"
                :showDatePicker="showDatePicker"
                :showWithPublic="true"
                @handleChangePublic="handleChangePublic"
                :createDate="createDate"
                @handleQuery="handleQuery" ref="queryForm"/>
        </template>
        <template slot="body" >
            <fs-query-list 
                :isUnread="true"
                url="/diaryQuery/getUnreadDiary"
                :withPublic="withPublic"
                :range="range" 
                :params="params" 
                :initCreateDate="initCreateDate" 
                :showDatePicker="showDatePicker"/>
        </template>
    </fs-frame>
</template>
<script>
    import query from 'app_src/mixins/query'
    export default {
        data() {
            return {
                range: '0',
                withPublic: false,
                showDatePicker: true,
                createDate: []
            }
        },
        mixins: [query],
        methods: {
            handleChangePublic(value) {
                this.withPublic = value
            },
            initCreateDate(createDate) {
                this.createDate = createDate;
            }
        },
        created () {
            this.$eventbus.$emit('getUnreadCount')
        }
    }
</script>
