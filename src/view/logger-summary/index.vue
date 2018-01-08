<template>
    <fs-frame>
        <template slot="head">
            <fs-query-form 
                :hasDefaultTemplate="false" 
                :showAllMember="true"
                :showTemplate="true" 
                :showTemplateCheck="true" 
                :showDatePicker="true" 
                templateType="select"
                @handleQuery="handleQuery" 
                :timeArr="timeArr"
                ref="queryForm"/>
        </template>
        <template slot="body">
            <fs-logger-summary :params="params" ref="loggerSummary" />
        </template>
    </fs-frame>
</template>
<script>
import FsFrame from '../frame/';
import FsLoggerSummary from 'app_component/logger-summary/';
import FsQueryForm from 'app_component/common/query-form/';
import formatTime from 'app_src/filters/format-time';

export default {
    data() {
        return {
            params: {}, 
            timeArr: []
        }
    },
    components: {
        FsFrame,
        FsLoggerSummary,
        FsQueryForm
    },
    methods: {
        handleQuery(params) {
            this.params = params;
        },
        init() {
            let now = (new Date()).valueOf();
            let beginDate = formatTime(new Date(now - 86400000 * 15), 'YYYY-MM-DD');
            let endDate = formatTime(new Date(now), 'YYYY-MM-DD');
            this.timeArr = [
                beginDate,
                endDate
            ];
        }
    },
    created () {
        this.init();
    }
}
</script>
