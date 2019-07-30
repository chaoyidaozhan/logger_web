<template>
    <fs-frame>
        <template slot="head">
            <fs-query-form 
                :showMember="true"
                :showTemplate="true"
                :showDatePicker="true"
                :showWithPublic="true"
                @handleChangePublic="handleChangePublic"
                @handleQuery="handleQuery" ref="queryForm"/>
        </template>
        <template slot="body" >
            <fs-query-list 
                :isUnread="true"
                url="/diaryQuery/getUnreadDiary"
                :withPublic="withPublic"
                :range="range" 
                :params="params" />
        </template>
    </fs-frame>
</template>
<script>
import query from 'app_src/mixins/query'
export default {
    data() {
        return {
            range: '0',
            withPublic: false
        }
    },
    mixins: [query],
    methods: {
        handleChangePublic(value) {
            this.withPublic = value
        }
    },
    created () {
        this.$eventbus.$emit('getUnreadCount')
    }
}
</script>
