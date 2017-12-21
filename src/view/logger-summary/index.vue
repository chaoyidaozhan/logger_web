<template>
    <fs-frame>
        <template slot="head">
            <span class="title">日志汇总</span> 
        </template>
        <template slot="body">
            <fs-logger-summary ref="loggerSummary" />
        </template>
    </fs-frame>
</template>
<script>
import FsFrame from '../frame/';
import FsLoggerSummary from 'app_component/logger-summary/';

export default {
    data() {
        return {
               
        }
    },
    components: {
        FsFrame,
        FsLoggerSummary,
    },
    methods: {
        handleQuery(params) {
            this.params = params;
            this.$refs.loggerStatistics.loadData();
        }
    }
}
</script>
