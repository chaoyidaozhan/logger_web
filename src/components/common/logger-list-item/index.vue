<template>
    <div class="logger-list-item">
        <div class="logger-list-user">
            <div class="logger-list-row">
                <span class="label">{{loggerItemData.userName}}</span>
                <span class="caption">{{loggerItemData.createTime | filterDiaryUserTime}}</span>
            </div>
        </div>
        <div class="logger-list-range ellipsis">
            <span class="caption" v-for="(item, index) in loggerItemData.range" :key="index">
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
        <div class="logger-list-time logger-list-row">
            <span class="label">日志日期</span>
            <span class="caption">{{loggerItemData.diaryTime | filterDiaryTime}}</span>
        </div>
        <div class="logger-list-content logger-list-row"
            v-for="(item, index) in JSON.parse(loggerItemData.content)"
            :key="index">
            <span class="label">{{item.title}}</span>
            <span class="caption">{{item.value || item.content}}</span>
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
        },
        filterDiaryUserTime(val) { // 格式化日志日期
            return FormatTime(new Date(val), 'MM-DD HH:mm')
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
    padding: 14px 30px;
    transition: .4s ease all;
    color: rgb(130, 130, 130);
    &>div {
        margin-bottom: 10px;
    }
    .logger-list-row {
        line-height: 1.5;
        span {
            display: block;
            font-size: 14px;
        }
        .label {
            color: @gray-color-dark;
        }
        .caption {
            color: @gray-color-light;
        }
    }

    .logger-list-user {
        .caption {
            font-size: 12px;
        }
    }
    .logger-list-range {
        color: @gray-color-light;
        font-size: 12px;
        padding: 1px 0;
    }
    .logger-list-tips {
        color: #fff;
        font-size: 12px;
        span {
            border-radius: 2px;
            margin-right: 5px;
            padding: 3px 4px;
            display: inline-block;
            background-color: @primary-color;
        }
    }
    &:hover {
        background-color: @white-color-light;
    }
}
</style>

