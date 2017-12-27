<template>
    <div class="logger-statistics" ref="loggerStatisticsWrapper">
        <fs-year-picker  v-if="params.orderType == 0 || params.orderType == 1" @handleChangeYear="handleChangeYear"/>
        <!-- <fs-month-picker @handleChangeMonth="handleChangeYear"/> -->
        <fs-logger-statistics-month 
            :data="list"
            :type="type"
            :title="title"
            v-if="params.orderType == 0"/>
        <fs-logger-statistics-season  
            :data="list"
            :type="type"
            :title="title"
            v-if="params.orderType == 1"/>
    </div>
</template>
<script>
import FsYearPicker from '../common/picker/year';
import FsMonthPicker from '../common/picker/month';
import FsLoggerStatisticsMonth from './logger-statistics-month';
import FsLoggerStatisticsSeason from './logger-statistics-season';
export default {
    props: {
        params: { // 暴露的对象字段
            type: Object,
            default() {
                return {
                    orderType: '0',
                }
            }
        },
        type: {
            type: String
        },
        title: {
            type: String,
            default: '名称'
        }
    },
    data() {
        return {
            list: [],
            years: (new Date()).getFullYear()
        }
    },
    components: {
        FsYearPicker,
        FsMonthPicker,
        FsLoggerStatisticsMonth,
        FsLoggerStatisticsSeason
    },
    watch: {
        params: 'loadData'
    },
    methods: {
        handleChangeYear(year) {
            this.years = year || (new Date()).getFullYear();
            this.loadData();
        },
        getParams() { // 获取参数
            return Object.assign({
                years: this.years
            }, this.params)
        },
        loadData() {
            this.$ajax({
                url: '/logger/diaryQuery/getStatisticsByCondition',
                data: this.getParams(),
                success: (res)=>{
                    if(res && res.code === 0) {
                        this.list = res.data;
                    }
                },
                error: (res)=>{
                    this.list = []
                }
            })
        },
        init() {
            this.handleChangeYear();
        }
    },
    created () {
        // this.init();
    },
    mounted () {
    }
}
</script>
<style lang="less" scoped>
.logger-statistics {
    padding: 0 20px;
    width: 100%;
    height: 100%;
}
</style>

