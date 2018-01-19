<template>
    <div class="select-date">
        <DatePicker type="daterange"
            placement="bottom-start"
            :value="timeArr"
            :editable="false"
            :options="options"
            @on-change="change"
            placeholder="日期" class="date-wrap">
        </DatePicker>
    </div>
</template>
<script>
export default {
    props: {
        timeArr: {
            type: Array,
            default: function () {
                return []
            }
        }
    },
    data() {
        return {
            options: {
                disabledDate (date) {
                    return date && date.valueOf() > Date.now();
                }
            },
            beginDate: "",
            endDate: "",
        }
    },
    methods: {
        change(params) {
            this.beginDate = params[0] || "";
            this.endDate = params[1] || "";
        },
        init() {
            this.beginDate = this.timeArr[0] || "";
            this.endDate = this.timeArr[1] || "";
        }
    },
    created () {
        this.init();
    }
}
</script>
<style lang="less">
.select-date {
    // margin-right: 15px;
    .date-wrap {
        width: 100%;
    }
    .ivu-input-icon-normal + .ivu-input {
        padding-right: 28px;
    }
}
</style>

