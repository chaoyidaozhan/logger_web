<template>
    <div class="select-date">
        <DatePicker type="daterange"
                    placement="bottom-start"
                    @on-change="change"
                    placeholder="日期" class="date-wrap">
        </DatePicker>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                beginDate: "",
                endDate: ""
            }
        },
        methods: {
            change(params) {
                this.beginDate = params[0] || "";
                this.endDate = params[1] || "";
            }
        }
    }
</script>
<style lang="less" scoped>
    .select-date {
        margin-right: 15px;
        .date-wrap {
            width: 100%;
        }
    }
</style>

