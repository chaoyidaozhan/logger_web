<template>
    <fs-frame>
        <template slot="head">
            <fs-query-form 
                :showTemplate="true"
                :showGroup="true"
                :showOrderType="true"
                showOrderTypeMulti="group"
                :showExportExcel="true"
                :showGroupExcelBtn="true"
                :showDeptExcelBtn="false"
                groupApiUri="/group/authMe"
                @handleQuery="handleQuery" ref="queryForm"/>
        </template>
        <template slot="body">
            <fs-common-statistics 
                :params="params"
                type="group"
                :title="`${$t('noun.internalGroup')} ${$t('noun.name')}`"
            />
        </template>
    </fs-frame>
</template>
<script>
import statistics from 'app_src/mixins/statistics'
export default {
    data() {
        return {
            params: {
                orderType: '4'
            },
            groupId: 0,
            validateString: 'groupId',
        }
    },
    mixins: [statistics]
}
</script>
