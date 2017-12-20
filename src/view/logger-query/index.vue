<template>
    <fs-frame>
        <template slot="head">
            <span class="title">日志查询</span> 
        </template>
        <template slot="body">
            <fs-logger-list ref="LoggerQueryList"/>
        </template>
    </fs-frame>
</template>
<script>
import FsFrame from '../frame/';
import FsLoggerList from 'app_component/common/logger-list/';
export default {
    components: {
        FsFrame,
        FsLoggerList
    }
}
</script>
