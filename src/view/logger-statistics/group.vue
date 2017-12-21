<template>
    <fs-frame>
        <template slot="head">
            <span class="title">团队统计</span> 
        </template>
        <template slot="body">
            <fs-logger-statistics 
                :params="params"
                type="group"
                ref="LoggerLoggerStatistics"/>
        </template>
    </fs-frame>
</template>
<script>
import FsFrame from '../frame/';
import FsLoggerStatistics from 'app_component/logger-statistics/'
export default {
    data() {
        return {
            params: {
                groupId: 0,
                orderType: '0'
            }
        }
    },
    components: {
        FsFrame,
        FsLoggerStatistics
    },
    methods: {
        handleQuery(params) {
            this.params = params;
            this.$refs.LoggerLoggerStatistics.loadData();
        }
    }
}
</script>
