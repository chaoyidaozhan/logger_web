<template>
    <div class="logger-statistics">
        <fs-year-picker @handleChangeYear="handleChangeYear"/>
        <fs-logger-statistics-month 
            :data="list"
            v-if="params.orderType == 0"/>
        <fs-logger-statistics-season v-if="params.orderType == 1"/>>
    </div>
</template>
<script>
import FsYearPicker from '../year-picker/';
import FsLoggerStatisticsMonth from './logger-statistics-month';
import FsLoggerStatisticsSeason from './logger-statistics-season';
export default {
    props: {
        params: { // 暴露的对象字段
            type: Object,
            default() {
                return {
                    groupId: '',
                    templateId: '',
                    deptId: '0',
                    orderType: '0',
                }
            }
        },
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
        },
        getParams() { // 获取参数
            let params = {};
            let keys = Object.keys(this.params);
            if(keys.length) {
                keys.forEach(key=>{
                    if(this.params[`${key}`]) {
                        params[`${key}`] = this.params[`${key}`]
                    }
                })
            }
            return Object.assign({
                years: this.years
            }, params)
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
            this.loadData();
        }
    },
    created () {
        this.init();
    }
}
</script>
