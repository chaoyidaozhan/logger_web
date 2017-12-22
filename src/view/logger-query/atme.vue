<template>
    <fs-frame>
        <template slot="head">
            <fs-query-form @handleQuery="handleQuery" ref="queryForm"/>
        </template>
        <template slot="body" >
            <fs-logger-list :range="range" :params="params" ref="loggerList"/>
        </template>
    </fs-frame>
</template>
<script>
import FsFrame from '../frame/';
import FsQueryForm from 'app_component/common/query-form/'
import FsLoggerList from 'app_component/logger-list/';
export default {
    data() {
        return {
            params: {},
            range: '4',
        }
    },
    components: {
        FsFrame,
        FsLoggerList,
        FsQueryForm,
    },
    methods: {
        handleQuery(params) {
            this.params = params;
        }
    },
}
</script>
