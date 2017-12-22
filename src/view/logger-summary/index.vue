<template>
    <fs-frame>
        <template slot="head">
            <fs-query-form 
                :hasDefaultTemplate="false" 
                :showTemplate="true" 
                :showTemplateCheck="true" 
                :showDatePicker="true" 
                @handleQuery="handleQuery" 
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
import FsQueryForm from 'app_component/common/query-form/'

export default {
    data() {
        return {
            params: {}, 
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
    }
}
</script>
