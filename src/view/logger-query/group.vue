<template>
    <fs-frame leftDistance="200px">
        <template slot="othter">
            <fs-group-menu @getDaily="getDaily"></fs-group-menu>
        </template>
        <template slot="head">
            <fs-query-form
                :showTemplate="true"
                :showDatePicker="true"
                @handleQuery="handleQuery" ref="queryForm"/>
        </template>
        <template slot="body" >
            <fs-logger-list v-if="hasLoadedGroup" :range="range" :params="params" ref="loggerList"/>
        </template>
    </fs-frame>
</template>
<script>
import query from 'app_src/mixins/query.js';
import FsGroupMenu from 'app_component/common/group-menu/';

export default {
    data() {
        return {
            range: '3',
            hasLoadedGroup: false
        }
    },
    components: {
        FsGroupMenu
    },
    mixins: [query],
    methods: {
        getDaily(groupId) {
            this.params = {
                ...this.params,
                groupId: groupId
            };
            this.hasLoadedGroup = true
        }
    }
}
</script>