<template>
    <fs-frame>
        <template slot="head">
            <span class="title">部门统计</span> 
        </template>
        <template slot="body">
            <fs-logger-statistics 
                :deptId="0"
                ref="LoggerLoggerStatistics"/>
        </template>
    </fs-frame>
</template>
<script>
import FsFrame from '../frame/';
import FsLoggerStatistics from '../../components/common/logger-statistics/'
export default {
    components: {
        FsFrame,
        FsLoggerStatistics
    }
}
</script>
