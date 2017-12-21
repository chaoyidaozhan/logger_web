<template>
    <fs-frame :leftDistance="range == 3 ? '200px' : ''">
        <template slot="othter" v-if="range == 3">
            <fs-group-menu></fs-group-menu>
        </template>
        <template slot="head">
            <!-- <span class="title">日志查询</span>  -->
            <fs-query-form @handleQuery="handleQuery" ref="queryForm"/>
        </template>
        <template slot="body" >
            <fs-logger-list :params="params" ref="loggerList"/>
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
            range: ''
        }
    },
    components: {
        FsFrame,
        FsLoggerList,
        FsQueryForm,
        FsGroupMenu
    },
    watch: {
        '$route': function (to, from) { // 切换初始化列表
            this.params = {};
            this.setRange();
            this.$refs.queryForm.resetQuery();
            this.$refs.loggerList.initList();
        }                                                    
    },
    methods: {
        handleQuery(params) {
            this.params = params;
        },
        setRange() {
            this.range = this.$route.params.range;
        }
    },
    created() {
        this.setRange();
    }
}
</script>
