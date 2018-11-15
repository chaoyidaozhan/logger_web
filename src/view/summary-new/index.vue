<template>
    <fs-frame>
        <template slot="head">
            日志汇总
             <span 
                class="pull-right" >
                <Button
                    @click="handleExport"
                    type="default">
                    {{$t('operate.export')}}EXCEL
                </Button>
                <Button
                    @click="handleSummary"
                    type="primary" >
                    {{$t('noun.summary')}}{{$t('noun.log')}}
                </Button>
            </span>
        </template>
        <template slot="body">
            <fs-summary-new ref="summary"/>
        </template>
    </fs-frame>
</template>
<script>
import FsFrame from 'app_view/frame/'
import FsSummaryNew from 'app_component/business/summary-new'
export default {
    data() {
        return {}
    },
    components: {
        FsFrame,
        FsSummaryNew
    },
    methods: {
        handleExport() { // 导出
            let params = {
                templateId: '',
                beginDate: '',
                endDate: '',
                language: '',
                token: this.$store.state.userInfo.token,
                memberIds: '',
                groupIds: '',
                deptIds: ''
            }
            let host = `${window.location.protocol}//${window.location.host}/logger`
            let uri = `${host}/diaryQuery/exportDiaryStatistics?timestamp=${(new Date()).valueOf()}`
            window.open(uri, '_blank')
        },
        handleSummary() { // 汇总日志
            this.$refs.summary.handleSummary()
        }
    }
}
</script>
