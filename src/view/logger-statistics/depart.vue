<template>
    <fs-frame>
        <template slot="head">
            <span class="title">部门统计</span> 
        </template>
        <template slot="body">
            <fs-logger-statistics 
                :params="params"
                type="depart"
                ref="loggerStatistics"/>
        </template>
    </fs-frame>
</template>
<script>
import FsFrame from '../frame/';
import FsLoggerStatistics from '../../components/common/logger-statistics/'
export default {
    data() {
        return {
            params: {
                deptId: 0,
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
            this.$refs.loggerStatistics.loadData();
        }
    }
}
</script>
