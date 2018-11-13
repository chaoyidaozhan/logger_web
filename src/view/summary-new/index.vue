<template>
    <fs-frame>
        <template slot="head">
            日志汇总
        </template>
        <template slot="body">
            <fs-summary-new />
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
    },
    created () {
    }
}
</script>
