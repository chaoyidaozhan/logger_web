<template>
    <fs-frame>
        <template slot="head">
            {{$t('menus.statistics')}}
            <span
                v-if="hasQuery"
                class="pull-right" >
                <YYButton
                    @click="handleExport"
                    type="default">
                    {{$t('operate.export')}}EXCEL
                </YYButton>
                <YYButton
                    @click="handleSummary"
                    type="primary" >
                    {{$t('noun.summary')}}{{$t('noun.log')}}
                </YYButton>
            </span>
        </template>
        <template slot="body">
            <fs-summary-new @handleHasQuery="handleHasQuery" ref="summary"/>
        </template>
    </fs-frame>
</template>
<script>
import FsFrame from 'app_view/frame/'
import FsSummaryNew from 'app_component/business/summary-new'
export default {
    data() {
        return {
            hasQuery: false
        }
    },
    components: {
        FsFrame,
        FsSummaryNew
    },
    methods: {
        handleExport() { // 导出
            let params = this.$refs.summary.getExportParams()
            if(params) {
                let host = __ENV__ === 'dev' ? `http://123.103.9.204:6058/logger` : `${window.location.protocol}//${window.location.host}/logger`
                let uri = `${host}/rest/v1/diaryStatistics/export?timestamp=${(new Date()).valueOf()}`
                Object.keys(params).forEach((key)=>{
                    if(params[key]) {
                        uri += `&${key}=${params[key]}`
                    }
                })
                window.open(uri, '_blank')
            }
        },
        handleSummary() { // 汇总日志
            this.$refs.summary.handleSummary()
        },
        handleHasQuery(param) {
            this.hasQuery = param
        }
    }
}
</script>
