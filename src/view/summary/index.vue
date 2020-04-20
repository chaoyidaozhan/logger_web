<template>
    <fs-frame>
        <template slot="head">
            <fs-query-form 
                :hasDefaultTemplate="false" 
                :showAllMember="true"
                :showTemplate="true" 
                :showTemplateCheck="true" 
                :showDatePicker="true" 
                :templateType="templateType"
                :showCreateMenu="false"
                @handleTemplateType="handleTemplateType"
                @handleQuery="handleQuery" 
                :createDate="createDate"
                ref="queryForm"/>
        </template>
        <template slot="body">
            <fs-logger-summary :params="params" ref="loggerSummary" />
        </template>
    </fs-frame>
</template>
<script>
import FsFrame from 'app_view/frame/'
import FsLoggerSummary from 'app_component/business/summary'
import FsQueryForm from 'app_component/common/query-form/'
import formatTime from 'app_src/filters/format-time'

export default {
    data() {
        return {
            params: {}, 
            createDate: [],
            templateType: 'select'
        }
    },
    components: {
        FsFrame,
        FsLoggerSummary,
        FsQueryForm
    },
    methods: {
        handleQuery(params) {
            this.params = params
        },
        handleTemplateType(type) {
            this.templateType = type || 'select'
        },
        init() {
            let now = (new Date()).valueOf()
            let beginDate = formatTime(new Date(now - 86400000 * 15), 'YYYY-MM-DD')
            let endDate = formatTime(new Date(now), 'YYYY-MM-DD')
            this.createDate = [
                beginDate,
                endDate
            ]
        }
    },
    created () {
        this.init();
    }
}
</script>
