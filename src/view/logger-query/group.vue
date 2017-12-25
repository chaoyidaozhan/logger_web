<template>
    <fs-frame :leftDistance="range == 3 ? '200px' : ''">
        <template slot="othter" v-if="range == 3">
            <fs-group-menu @getDaily="getDaily"></fs-group-menu>
        </template>
        <template slot="head">
            <fs-query-form
                :showTemplate="true"
                :showDatePicker="true"
                @handleQuery="handleQuery" ref="queryForm"/>
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
import FsGroupMenu from 'app_component/common/group-menu/';
export default {
    data() {
        return {
            params: {},
            range: '3',
        }
    },
    components: {
        FsFrame,
        FsLoggerList,
        FsQueryForm,
        FsGroupMenu
    },
    methods: {
        handleQuery(params) {
            this.params = params;
        },
        getDaily(groupId) {
            this.params = {
                ...this.params,
                groupId: groupId
            };
        }
    },
}
</script>
