<template>
    <div class="logger-statistics" ref="loggerStatisticsWrapper">
        <fs-year-picker @handleChangeYear="handleChangeYear"/>
        <fs-logger-statistics-month 
            :data="list"
            :type="type"
            v-if="params.orderType == 0 && !!list.length"/>
        <fs-logger-statistics-season  
            :data="list"
            :type="type"
            v-if="params.orderType == 1 && !!list.length"/>
    </div>
</template>
<script>
import FsYearPicker from '../common/year-picker/';
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
        }
    },
    data() {
        return {
            list: [],
            years: ''
        }
    },
    components: {
        FsYearPicker,
        FsLoggerStatisticsMonth,
        FsLoggerStatisticsSeason
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
        this.init();
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

