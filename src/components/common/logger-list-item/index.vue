<template>
    <div class="logger-list-item">
        <div class="logger-list-user">
            <div class="logger-list-row">
                <span class="label">{{loggerItemData.userName}}</span>
                <span class="caption">{{loggerItemData.createTime | filterDiaryUserTime}}</span>
            </div>
        </div>
        <div class="logger-list-range">
            <div class="ellipsis">
                <span class="caption" v-for="(item, index) in loggerItemData.range" :key="index">
                    {{item.teamName || item.spaceName}}
                </span>
            </div>
            <div class="tool-tip">
                {{renderRange(loggerItemData.range)}}
            </div>
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
        renderRange(range) {
            let str = ''
            range.forEach(item=>{
                str += `${item.teamName || item.spaceName} `
            })
            return str;
        }
    },
    created () {
        console.log(this.loggerItemData)
        console.log( JSON.parse(this.loggerItemData.content))
    }
}
</script>
<style lang="less">
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
        margin-top: 5px;
        position: relative;
        .ellipsis {
            padding: 1px 0;
            &::after {
               position: absolute;
               content: '';
               left: 0;
               right: 0;
               height: 10px;
               bottom: -10px;
            }
        }
       .tool-tip {
           visibility: hidden;
           position: absolute;
           opacity: 0;
           top: 23px;
           transition: .2s ease all;
           background-color: #fff;
           border:1px solid @gray-color-normal;
           color: @gray-color-dark;
           font-size: 12px;
           line-height: 1.5;
           padding: 8px;
           border-radius: 6px;
           max-width: 100%;
           min-width: 100px;
           left:50%;
           margin-left: -50%;
           word-break: break-all;

           &:before, &:after {
               position: absolute;
               top: -10px;
               border-width: 0  10px 10px 10px;
               border-color: @gray-color-normal transparent @gray-color-normal transparent;
               border-style: solid;
               width: 0;
               left: 50%;
               content: '';
           }
           &:after {
               top: -9px;
               border-color: #fff transparent #fff transparent;
           }
       }
       &:hover {
        .tool-tip {
            opacity: 1;
            visibility: visible;
        }           
       }
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

