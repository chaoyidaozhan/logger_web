<template>
    <fs-frame>
        <template slot="head">
            <fs-query-form 
                :showTemplate="true"
                :showMember="true"
                :showOrderType="true"
                @handleQuery="handleQuery" ref="queryForm"/>
        </template>
        <template slot="body">
            <fs-member-statistics 
                :params="params"
                type="user"
                title="人员名称"
                ref="LoggerLoggerStatistics"/>
        </template>
    </fs-frame>
</template>
<script>
import statistics from 'app_src/mixins/statistics';
export default {
    data() {
        return {
            validateString: 'memberIds',
        }
    },
    mixins: [statistics],
    methods: {
        handleQuery(params) {
            params.orderType = 4
            this.params = params;
        }
    }
}
</script>