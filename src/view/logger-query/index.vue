<template>
    <fs-frame>
        <template slot="head">
            <span class="title">日志查询</span> 
        </template>
        <template slot="body">
            <fs-logger-query-list ref="LoggerQueryList"/>
        </template>
    </fs-frame>
</template>
<script>
import FsFrame from '../frame/';
import FsLoggerQueryList from 'app_component/logger-query/';
export default {
    watch: {
        '$route': function (to, from) { // 路由权限控制
            // this.$refs.LoggerQueryList.initList()
        }
    },
    components: {
        FsFrame,
        FsLoggerQueryList
    }
}
</script>
