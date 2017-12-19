<template>
    <div class="logger-list-item">
        <div class="logger-list-range ellipsis">
            <span v-for="(item, index) in loggerItemData.range" :key="index">
                {{item.teamName || item.spaceName}}
            </span>
        </div>
        <div class="logger-list-tips">
            <span v-if="loggerItemData.templateName">
                {{loggerItemData.templateName}}
            </span>
            <span>
                {{dataSource[loggerItemData.dataType || 0]}}
            </span>
        </div>
        <div class="logger-list-time">
            <span>日志日期</span>
            <span>{{loggerItemData.diaryTime | filterDiaryTime}}</span>
        </div>
        <div class="logger-list-content"
            v-for="(item, index) in JSON.parse(loggerItemData.content)"
            :key="index">
            <span class="logger-list-content-title">{{item.title}}</span>
            <span class="logger-list-content-value">{{item.value || item.content}}</span>
        </div>
        <div class="logger-list-operate">

        </div>
    </div>
</template>
<script>
import FormatTime from '../../../filters/format-time';
export default {
    props: {
        loggerItemData: {
            type: Object
        }
    },
    data() {
        return {
            dataSource: ["其他", "日报", "周报", "月报", "其他"]
        }
    },
    filters: {
        filterDiaryTime(val) { // 格式化日志日期
            return FormatTime(new Date(val), 'YYYY-MM-DD')
        }
    },
    methods: {
        
    },
    created () {
        console.log(this.loggerItemData)
        console.log( JSON.parse(this.loggerItemData.content))
    }
}
</script>
<style lang="less" scoped>
@import '../../../assets/css/var.less';
.logger-list-item {
    .logger-list-range {
        color: @gray-color-light;
        font-size: 12px;
    }
    &:hover {
        background-color: @white-color-light;
    }
}
</style>

