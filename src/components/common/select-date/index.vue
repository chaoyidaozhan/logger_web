<template>
    <div class="select-date">
        <DatePicker :type="dateType"
            placement="bottom-start"
            :value="dateType === 'date' ? selectDate : createDate"
            :editable="false"
            :options="options"
            @on-change="change"
            :placeholder="`${$t('operate.please')}${$t('operate.select')}`" class="date-wrap">
        </DatePicker>
    </div>
</template>
<script>
export default {
    props: {
        dateType: {
            type: String,
            default: 'daterange'
        },
        createDate: {
            type: Array,
            default: function () {
                return []
            }
        },
        selectDate: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            options: {
                disabledDate (date) {
                    return date && date.valueOf() > Date.now();
                }
            },
            date: "",
            beginDate: "",
            endDate: "",
        }
    },
    methods: {
        change(params) {
            if(this.dateType === 'date') {
                return this.date = params
            }
            this.beginDate = params[0] || "";
            this.endDate = params[1] || "";
        },
        init() {
            if(this.dateType === 'date') {
                return this.date = this.selectDate
            }
            this.beginDate = this.createDate[0] || "";
            this.endDate = this.createDate[1] || "";
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

