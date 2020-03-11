<template>
    <fs-frame leftDistance="260px">
        <template slot="othter">
            <fs-group-menu @getDaily="getDaily"></fs-group-menu>
        </template>
        <template slot="head">
            <fs-query-form
                :showTemplate="true"
                :showDatePicker="showDatePicker"
                :createDate="createDate"
                @handleQuery="handleQuery" ref="queryForm"/>
        </template>
        <template slot="body" >
            <fs-query-list v-if="hasLoadedGroup" :range="range" :params="params" :initCreateDate="initCreateDate" :showDatePicker="showDatePicker"/>
        </template>
    </fs-frame>
</template>
<script>
    import query from 'app_src/mixins/query'
    import FsGroupMenu from 'app_component/common/group-menu/'

    export default {
        data() {
            return {
                range: '3',
                hasLoadedGroup: false,
                groupId: '',
                showDatePicker: true,
                createDate: []
            }
        },
        components: {
            FsGroupMenu
        },
        mixins: [query],
        methods: {
            getDaily(groupId) {
                this.groupId = groupId
                this.params = {
                    ...this.params,
                    groupId: groupId
                };
                this.hasLoadedGroup = true
            },
            handleQuery(params) {
                if(this.groupId) {
                    params.groupId = this.groupId
                }
                this.params = params
            },
            initCreateDate(createDate) {
                this.createDate = createDate;
            }
        }
    }
</script>
